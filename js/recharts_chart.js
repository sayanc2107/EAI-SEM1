/* ===================================================================
   MedCore AI — Recharts-Grade Interactive Line Chart Engine
   Renders high-performance, responsive SVG Line Charts with
   smooth Bezier curves, Cartesian grid, animated hover crosshairs,
   rich clinical tooltips, and interactive multi-series legend toggles.
   =================================================================== */

class RechartsVitalsLineChart {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = Object.assign({
            height: 320,
            margin: { top: 20, right: 30, bottom: 35, left: 45 },
            gridColor: '#1e293b',
            axisColor: '#64748b',
            textColor: '#94a3b8',
            series: [
                { key: 'heartRate', name: 'Heart Rate (BPM)', color: '#ef4444', unit: 'bpm', active: true },
                { key: 'bpSys', name: 'Systolic BP', color: '#8b5cf6', unit: 'mmHg', active: true },
                { key: 'bpDia', name: 'Diastolic BP', color: '#3b82f6', unit: 'mmHg', active: true },
                { key: 'spo2', name: 'SpO2 (%)', color: '#0ea5e9', unit: '%', active: true }
            ]
        }, options);

        this.data = [];
        this.activeSeries = new Set(this.options.series.map(s => s.key));
        this.tooltip = null;
        this.init();
    }

    init() {
        if (!this.container) return;
        this.container.innerHTML = '';
        this.container.style.position = 'relative';
        this.container.style.width = '100%';

        // Create Tooltip
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'recharts-custom-tooltip';
        this.tooltip.style.cssText = `
            position: absolute; display: none; pointer-events: none; z-index: 100;
            background: rgba(15, 23, 42, 0.95); border: 1px solid #334155;
            border-radius: 8px; padding: 10px 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            font-size: 12px; color: #f8fafc; backdrop-filter: blur(8px); min-width: 170px;
        `;
        this.container.appendChild(this.tooltip);

        // Window resize listener
        this._resizeHandler = () => this.render();
        window.addEventListener('resize', this._resizeHandler);
    }

    destroy() {
        window.removeEventListener('resize', this._resizeHandler);
    }

    setData(data) {
        this.data = Array.isArray(data) ? data : [];
        this.render();
    }

    toggleSeries(key) {
        if (this.activeSeries.has(key)) {
            if (this.activeSeries.size > 1) this.activeSeries.delete(key);
        } else {
            this.activeSeries.add(key);
        }
        this.render();
    }

    render() {
        if (!this.container) return;

        // Clean previous svg and legend
        const existingSvg = this.container.querySelector('svg');
        if (existingSvg) existingSvg.remove();
        const existingLegend = this.container.querySelector('.recharts-legend-bar');
        if (existingLegend) existingLegend.remove();

        const width = this.container.clientWidth || 600;
        const height = this.options.height;
        const m = this.options.margin;
        const innerW = Math.max(10, width - m.left - m.right);
        const innerH = Math.max(10, height - m.top - m.bottom);

        // Build Legend Bar
        const legendBar = document.createElement('div');
        legendBar.className = 'recharts-legend-bar';
        legendBar.style.cssText = `
            display: flex; flex-wrap: wrap; justify-content: center; gap: 16px;
            margin-bottom: 12px; font-size: 12px;
        `;

        this.options.series.forEach(s => {
            const isActive = this.activeSeries.has(s.key);
            const item = document.createElement('div');
            item.style.cssText = `
                display: flex; align-items: center; gap: 6px; cursor: pointer;
                opacity: ${isActive ? '1' : '0.4'}; transition: opacity 0.2s; user-select: none;
            `;
            item.innerHTML = `
                <span style="display:inline-block;width:12px;height:3px;background:${s.color};border-radius:2px"></span>
                <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${s.color};margin-left:-9px"></span>
                <span style="color:#e2e8f0;font-weight:600">${s.name}</span>
            `;
            item.onclick = () => this.toggleSeries(s.key);
            legendBar.appendChild(item);
        });
        this.container.appendChild(legendBar);

        if (!this.data || this.data.length === 0) {
            const noData = document.createElement('div');
            noData.style.cssText = 'height:240px;display:flex;align-items:center;justify-content:center;color:#64748b;font-size:13px;';
            noData.textContent = 'No vitals logged yet. Use the "+ Log New Vitals" button below to add first measurement.';
            this.container.appendChild(noData);
            return;
        }

        // Compute Value Range
        let minY = 60;
        let maxY = 180;
        this.data.forEach(d => {
            this.options.series.forEach(s => {
                if (this.activeSeries.has(s.key) && d[s.key] != null) {
                    minY = Math.min(minY, d[s.key]);
                    maxY = Math.max(maxY, d[s.key]);
                }
            });
        });
        minY = Math.max(0, Math.floor(minY / 10) * 10 - 10);
        maxY = Math.ceil(maxY / 10) * 10 + 10;
        if (minY === maxY) maxY += 20;

        // Scales
        const getX = (index) => {
            if (this.data.length === 1) return m.left + innerW / 2;
            return m.left + (index / (this.data.length - 1)) * innerW;
        };
        const getY = (val) => {
            return m.top + innerH - ((val - minY) / (maxY - minY)) * innerH;
        };

        // Create SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.style.cssText = 'display:block; overflow:visible; font-family:Inter,sans-serif;';

        // Defs: Gradients
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        this.options.series.forEach(s => {
            const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            grad.setAttribute('id', `recharts-grad-${s.key}`);
            grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
            grad.setAttribute('x2', '0'); grad.setAttribute('y2', '1');
            grad.innerHTML = `
                <stop offset="5%" stop-color="${s.color}" stop-opacity="0.25"/>
                <stop offset="95%" stop-color="${s.color}" stop-opacity="0.0"/>
            `;
            defs.appendChild(grad);
        });
        svg.appendChild(defs);

        // Cartesian Grid
        const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        gridGroup.setAttribute('stroke', this.options.gridColor);
        gridGroup.setAttribute('stroke-dasharray', '3 3');
        gridGroup.setAttribute('stroke-width', '1');

        const ySteps = 5;
        for (let i = 0; i <= ySteps; i++) {
            const yVal = minY + (i / ySteps) * (maxY - minY);
            const yPos = getY(yVal);
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', m.left);
            line.setAttribute('y1', yPos);
            line.setAttribute('x2', m.left + innerW);
            line.setAttribute('y2', yPos);
            gridGroup.appendChild(line);

            // Y-axis label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', m.left - 8);
            text.setAttribute('y', yPos + 4);
            text.setAttribute('text-anchor', 'end');
            text.setAttribute('fill', this.options.textColor);
            text.setAttribute('font-size', '11');
            text.textContent = Math.round(yVal);
            svg.appendChild(text);
        }
        svg.appendChild(gridGroup);

        // X-axis baseline
        const xAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        xAxisLine.setAttribute('x1', m.left);
        xAxisLine.setAttribute('y1', m.top + innerH);
        xAxisLine.setAttribute('x2', m.left + innerW);
        xAxisLine.setAttribute('y2', m.top + innerH);
        xAxisLine.setAttribute('stroke', this.options.axisColor);
        xAxisLine.setAttribute('stroke-width', '1');
        svg.appendChild(xAxisLine);

        // X-axis timestamps
        this.data.forEach((d, idx) => {
            const xPos = getX(idx);
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', xPos);
            text.setAttribute('y', m.top + innerH + 20);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', this.options.textColor);
            text.setAttribute('font-size', '11');
            text.textContent = d.time || `T+${idx}`;
            svg.appendChild(text);
        });

        // Helper: Smooth Bezier Path calculation
        const createSmoothPath = (points) => {
            if (points.length === 0) return '';
            if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
            let d = `M ${points[0].x} ${points[0].y}`;
            for (let i = 0; i < points.length - 1; i++) {
                const p0 = points[i === 0 ? 0 : i - 1];
                const p1 = points[i];
                const p2 = points[i + 1];
                const p3 = points[i + 2] || p2;

                const cp1x = p1.x + (p2.x - p0.x) / 6;
                const cp1y = p1.y + (p2.y - p0.y) / 6;
                const cp2x = p2.x - (p3.x - p1.x) / 6;
                const cp2y = p2.y - (p3.y - p1.y) / 6;

                d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
            }
            return d;
        };

        // Render Lines and Area under curves
        this.options.series.forEach(s => {
            if (!this.activeSeries.has(s.key)) return;

            const points = [];
            this.data.forEach((d, idx) => {
                const val = d[s.key];
                if (val != null) {
                    points.push({ x: getX(idx), y: getY(val), val, data: d, index: idx });
                }
            });

            if (points.length === 0) return;

            // Area path
            if (points.length > 1) {
                const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const lineD = createSmoothPath(points);
                const firstPt = points[0];
                const lastPt = points[points.length - 1];
                const areaD = `${lineD} L ${lastPt.x} ${m.top + innerH} L ${firstPt.x} ${m.top + innerH} Z`;
                areaPath.setAttribute('d', areaD);
                areaPath.setAttribute('fill', `url(#recharts-grad-${s.key})`);
                svg.appendChild(areaPath);
            }

            // Stroke line
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', createSmoothPath(points));
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', s.color);
            path.setAttribute('stroke-width', '2.5');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
            svg.appendChild(path);

            // Dots
            points.forEach(pt => {
                const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                dot.setAttribute('cx', pt.x);
                dot.setAttribute('cy', pt.y);
                dot.setAttribute('r', '4');
                dot.setAttribute('fill', '#0f172a');
                dot.setAttribute('stroke', s.color);
                dot.setAttribute('stroke-width', '2');
                svg.appendChild(dot);
            });
        });

        // Interactive Crosshair & Hover Overlay
        const crosshair = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        crosshair.setAttribute('stroke', '#475569');
        crosshair.setAttribute('stroke-width', '1');
        crosshair.setAttribute('stroke-dasharray', '4 4');
        crosshair.setAttribute('y1', m.top);
        crosshair.setAttribute('y2', m.top + innerH);
        crosshair.style.display = 'none';
        svg.appendChild(crosshair);

        // Overlay transparent rect for capturing mouse events
        const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        overlay.setAttribute('x', m.left);
        overlay.setAttribute('y', m.top);
        overlay.setAttribute('width', innerW);
        overlay.setAttribute('height', innerH);
        overlay.setAttribute('fill', 'transparent');
        overlay.style.cursor = 'crosshair';

        overlay.addEventListener('mousemove', (e) => {
            const rect = svg.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;

            // Find closest data point
            let closestIdx = 0;
            let minDist = Infinity;
            this.data.forEach((d, idx) => {
                const ptX = getX(idx);
                const dist = Math.abs(mouseX - ptX);
                if (dist < minDist) {
                    minDist = dist;
                    closestIdx = idx;
                }
            });

            const pointX = getX(closestIdx);
            crosshair.setAttribute('x1', pointX);
            crosshair.setAttribute('x2', pointX);
            crosshair.style.display = 'block';

            // Show Tooltip
            const item = this.data[closestIdx];
            let rowsHtml = '';
            this.options.series.forEach(s => {
                if (this.activeSeries.has(s.key) && item[s.key] != null) {
                    rowsHtml += `
                        <div style="display:flex; justify-content:space-between; gap:12px; margin-top:4px;">
                            <span style="color:#cbd5e1; display:flex; align-items:center; gap:6px;">
                                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${s.color}"></span>
                                ${s.name}:
                            </span>
                            <span style="font-weight:700; color:#fff;">${item[s.key]} ${s.unit}</span>
                        </div>
                    `;
                }
            });

            if (item.temp) {
                rowsHtml += `
                    <div style="display:flex; justify-content:space-between; gap:12px; margin-top:4px;">
                        <span style="color:#cbd5e1;"><i class="fas fa-thermometer-half" style="color:#f59e0b"></i> Temp:</span>
                        <span style="font-weight:700; color:#fff;">${item.temp} °F</span>
                    </div>
                `;
            }

            this.tooltip.innerHTML = `
                <div style="font-weight:700; color:#38bdf8; border-bottom:1px solid #334155; padding-bottom:4px; margin-bottom:4px;">
                    <i class="fas fa-clock"></i> Timestamp: ${item.time || `Log #${closestIdx + 1}`}
                </div>
                ${rowsHtml}
            `;
            this.tooltip.style.display = 'block';

            // Position tooltip
            const containerW = this.container.clientWidth;
            let leftPos = pointX + 15;
            if (leftPos + 200 > containerW) {
                leftPos = pointX - 190;
            }
            this.tooltip.style.left = `${leftPos}px`;
            this.tooltip.style.top = `${m.top + 20}px`;
        });

        overlay.addEventListener('mouseleave', () => {
            crosshair.style.display = 'none';
            this.tooltip.style.display = 'none';
        });

        svg.appendChild(overlay);
        this.container.appendChild(svg);
    }
}
window.RechartsVitalsLineChart = RechartsVitalsLineChart;
