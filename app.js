(() => {
  // js/constants.js
  var MQ_SENSORS = [
    "MQ-2",
    "MQ-3",
    "MQ-4",
    "MQ-5",
    "MQ-6",
    "MQ-7",
    "MQ-8",
    "MQ-9",
    "MQ-135"
  ];
  var MQ_SENSOR_TARGETS = {
    "MQ-2": "\u0433\u043E\u0440\u044E\u0447\u0438\u0435 \u0433\u0430\u0437\u044B, \u0434\u044B\u043C",
    "MQ-3": "\u0441\u043F\u0438\u0440\u0442\u044B, \u043F\u0430\u0440\u044B \u0430\u043B\u043A\u043E\u0433\u043E\u043B\u044F",
    "MQ-4": "\u043C\u0435\u0442\u0430\u043D, \u043F\u0440\u0438\u0440\u043E\u0434\u043D\u044B\u0439 \u0433\u0430\u0437",
    "MQ-5": "LPG, \u043F\u0440\u0438\u0440\u043E\u0434\u043D\u044B\u0439 \u0433\u0430\u0437",
    "MQ-6": "\u043F\u0440\u043E\u043F\u0430\u043D, \u0431\u0443\u0442\u0430\u043D, LPG",
    "MQ-7": "CO, \u0443\u0433\u0430\u0440\u043D\u044B\u0439 \u0433\u0430\u0437",
    "MQ-8": "\u0432\u043E\u0434\u043E\u0440\u043E\u0434",
    "MQ-9": "CO \u0438 \u0433\u043E\u0440\u044E\u0447\u0438\u0435 \u0433\u0430\u0437\u044B",
    "MQ-135": "NH3, \u0431\u0435\u043D\u0437\u043E\u043B, VOC, \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u043E \u0432\u043E\u0437\u0434\u0443\u0445\u0430"
  };
  var REQUIRED_COLUMNS = [
    "datetime",
    ...MQ_SENSORS,
    "WindDirRaw",
    "WindSpeedRaw",
    "TempC",
    "Hum",
    "Lat",
    "Lon"
  ];
  var SESSION_GAP_MS = 5 * 60 * 1e3;
  var GPS_JUMP_SPEED_KMH = 200;
  var DEFAULT_MQ_THRESHOLD = 50;
  var DEFAULT_TIMELINE_METRICS = ["MQ-135", "MQ-7", "MQ-2"];
  var DEFAULT_HEATMAP_METRICS = [
    ...MQ_SENSORS,
    "WindSpeedMps",
    "TempC",
    "Hum"
  ];
  var CHART_PALETTE = [
    "#0f8f86",
    "#dd8d31",
    "#465fbc",
    "#c24f5a",
    "#5b8f3b",
    "#8a5fb4",
    "#2d7f98",
    "#b06d18",
    "#8a4636",
    "#356f64"
  ];
  var MAP_GRADIENT = [
    "#0f4c5c",
    "#167f8b",
    "#2db0a7",
    "#8fcf7e",
    "#f0d06b",
    "#ed9f32",
    "#cf5537"
  ];
  var DEFAULT_WIND_DIRECTION_ANCHORS = [
    { raw: 0, degrees: 0, label: "N", tolerance: 1200 },
    { raw: 3800, degrees: 45, label: "NE", tolerance: 1200 },
    { raw: 7600, degrees: 90, label: "E", tolerance: 1200 },
    { raw: 11400, degrees: 135, label: "SE", tolerance: 1200 },
    { raw: 15200, degrees: 180, label: "S", tolerance: 1200 },
    { raw: 19e3, degrees: 225, label: "SW", tolerance: 1200 },
    { raw: 22800, degrees: 270, label: "W", tolerance: 1200 },
    { raw: 26663, degrees: 315, label: "NW", tolerance: 1200 }
  ];
  var DEFAULT_MQ_PRESET_POINTS = {
    "MQ-2": {
      unit: "ppm",
      point1: { raw: 3e3, value: 300 },
      point2: { raw: 12e3, value: 1e4 }
    },
    "MQ-3": {
      unit: "mg/L",
      point1: { raw: 3e3, value: 0.1 },
      point2: { raw: 12e3, value: 4 }
    },
    "MQ-4": {
      unit: "ppm",
      point1: { raw: 1500, value: 300 },
      point2: { raw: 12e3, value: 1e4 }
    },
    "MQ-5": {
      unit: "ppm",
      point1: { raw: 6e3, value: 200 },
      point2: { raw: 18e3, value: 1e4 }
    },
    "MQ-6": {
      unit: "ppm",
      point1: { raw: 9e3, value: 300 },
      point2: { raw: 18e3, value: 1e4 }
    },
    "MQ-7": {
      unit: "ppm",
      point1: { raw: 4e3, value: 20 },
      point2: { raw: 12e3, value: 2e3 }
    },
    "MQ-8": {
      unit: "ppm",
      point1: { raw: 3500, value: 100 },
      point2: { raw: 12e3, value: 1e4 }
    },
    "MQ-9": {
      unit: "ppm",
      point1: { raw: 250, value: 10 },
      point2: { raw: 4e3, value: 1e3 }
    },
    "MQ-135": {
      unit: "ppm",
      point1: { raw: 200, value: 10 },
      point2: { raw: 2e3, value: 300 }
    }
  };
  var DEFAULT_UI_FILTERS = {
    sessionId: "all",
    metric: "MQ-135",
    mode: "calibrated",
    from: "",
    to: "",
    onlyGps: false,
    onlyWeather: false,
    hideSuspiciousGps: true,
    hideMqOff: true,
    filterByViewport: false,
    metricMin: "",
    metricMax: "",
    showIdw: true
  };
  var DEFAULT_UI_DEFAULTS = {
    filters: { ...DEFAULT_UI_FILTERS },
    timelineMetrics: [...DEFAULT_TIMELINE_METRICS],
    scatterX: "MQ-135",
    scatterY: "TempC"
  };
  var METRIC_DEFINITIONS = [
    {
      key: "WindDirRaw",
      label: "\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0432\u0435\u0442\u0440\u0430 (raw)",
      unit: "ADC",
      category: "wind",
      supportsMode: false
    },
    {
      key: "WindSpeedRaw",
      label: "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0432\u0435\u0442\u0440\u0430 (raw)",
      unit: "ADC",
      category: "wind",
      supportsMode: false
    },
    {
      key: "WindDirDegrees",
      label: "\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0432\u0435\u0442\u0440\u0430",
      unit: "\xB0",
      category: "wind",
      supportsMode: false
    },
    {
      key: "WindSpeedMps",
      label: "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u0432\u0435\u0442\u0440\u0430",
      unit: "\u043C/\u0441",
      category: "wind",
      supportsMode: false
    },
    {
      key: "TempC",
      label: "\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430",
      unit: "\xB0C",
      category: "weather",
      supportsMode: false
    },
    {
      key: "Hum",
      label: "\u0412\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C",
      unit: "%RH",
      category: "weather",
      supportsMode: false
    },
    {
      key: "DewPoint",
      label: "\u0422\u043E\u0447\u043A\u0430 \u0440\u043E\u0441\u044B",
      unit: "\xB0C",
      category: "weather",
      supportsMode: false
    },
    {
      key: "Lat",
      label: "\u0428\u0438\u0440\u043E\u0442\u0430",
      unit: "\xB0",
      category: "gps",
      supportsMode: false
    },
    {
      key: "Lon",
      label: "\u0414\u043E\u043B\u0433\u043E\u0442\u0430",
      unit: "\xB0",
      category: "gps",
      supportsMode: false
    }
  ];

  // js/utils.js
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
  function round(value, digits = 2) {
    if (!Number.isFinite(value)) {
      return null;
    }
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
  }
  function safeNumber(value) {
    if (value === null || value === void 0 || value === "") {
      return null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  function formatNumber(value, digits = 2) {
    if (!Number.isFinite(value)) {
      return "\u2014";
    }
    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: digits
    }).format(value);
  }
  function formatInteger(value) {
    if (!Number.isFinite(value)) {
      return "\u2014";
    }
    return new Intl.NumberFormat("ru-RU", {
      maximumFractionDigits: 0
    }).format(value);
  }
  function formatPercent(value, digits = 1) {
    if (!Number.isFinite(value)) {
      return "\u2014";
    }
    return `${formatNumber(value, digits)}%`;
  }
  function formatDateTime(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return "\u2014";
    }
    return new Intl.DateTimeFormat("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(date);
  }
  function parseDeviceDateTime(value) {
    if (!value || typeof value !== "string") {
      return null;
    }
    const match = value.match(
      /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/
    );
    if (!match) {
      return null;
    }
    const [, year, month, day, hour, minute, second] = match;
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    );
  }
  function parseDateTimeLocal(value) {
    if (!value) {
      return null;
    }
    const match = value.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/
    );
    if (!match) {
      return null;
    }
    const [, year, month, day, hour, minute] = match;
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      0
    );
  }
  function computeDewPoint(tempC, humidity) {
    if (!Number.isFinite(tempC) || !Number.isFinite(humidity) || humidity <= 0) {
      return null;
    }
    const a = 17.27;
    const b = 237.7;
    const alpha = a * tempC / (b + tempC) + Math.log(humidity / 100);
    return b * alpha / (a - alpha);
  }
  function haversineKm(lat1, lon1, lat2, lon2) {
    const radians = (value) => value * Math.PI / 180;
    const earthRadiusKm = 6371;
    const dLat = radians(lat2 - lat1);
    const dLon = radians(lon2 - lon1);
    const sinLat = Math.sin(dLat / 2);
    const sinLon = Math.sin(dLon / 2);
    const a = sinLat * sinLat + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * sinLon * sinLon;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }
  function average(values) {
    const valid = values.filter((value) => Number.isFinite(value));
    if (!valid.length) {
      return null;
    }
    return valid.reduce((sum, value) => sum + value, 0) / valid.length;
  }
  function pearsonCorrelation(pairs) {
    if (!pairs.length) {
      return null;
    }
    const xs = pairs.map(([x]) => x);
    const ys = pairs.map(([, y]) => y);
    const meanX = average(xs);
    const meanY = average(ys);
    if (!Number.isFinite(meanX) || !Number.isFinite(meanY)) {
      return null;
    }
    let numerator = 0;
    let sumX = 0;
    let sumY = 0;
    for (const [x, y] of pairs) {
      const dx = x - meanX;
      const dy = y - meanY;
      numerator += dx * dy;
      sumX += dx * dx;
      sumY += dy * dy;
    }
    if (sumX === 0 || sumY === 0) {
      return null;
    }
    return numerator / Math.sqrt(sumX * sumY);
  }
  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }
  function interpolateHexColor(colorA, colorB, ratio) {
    const parse = (hex) => {
      const clean = hex.replace("#", "");
      return [
        Number.parseInt(clean.slice(0, 2), 16),
        Number.parseInt(clean.slice(2, 4), 16),
        Number.parseInt(clean.slice(4, 6), 16)
      ];
    };
    const [r1, g1, b1] = parse(colorA);
    const [r2, g2, b2] = parse(colorB);
    const channel = (start, end) => Math.round(start + (end - start) * clamp(ratio, 0, 1)).toString(16).padStart(2, "0");
    return `#${channel(r1, r2)}${channel(g1, g2)}${channel(b1, b2)}`;
  }
  function createColorScale(stops, min, max) {
    return (value) => {
      if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) {
        return stops[0];
      }
      if (min === max) {
        return stops[stops.length - 1];
      }
      const scaled = clamp((value - min) / (max - min), 0, 1);
      const slot = scaled * (stops.length - 1);
      const low = Math.floor(slot);
      const high = Math.min(stops.length - 1, Math.ceil(slot));
      if (low === high) {
        return stops[low];
      }
      return interpolateHexColor(stops[low], stops[high], slot - low);
    };
  }
  function debounce(callback, waitMs = 150) {
    let timeoutId = 0;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => callback(...args), waitMs);
    };
  }
  function downloadTextFile(filename, text, mimeType = "text/plain;charset=utf-8") {
    const blob = new Blob([text], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
  function formatDurationMs(durationMs) {
    if (!Number.isFinite(durationMs)) {
      return "\u2014";
    }
    const totalMinutes = Math.round(durationMs / 6e4);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor(totalMinutes % (60 * 24) / 60);
    const minutes = totalMinutes % 60;
    const parts = [];
    if (days) {
      parts.push(`${days} \u0434`);
    }
    if (hours) {
      parts.push(`${hours} \u0447`);
    }
    if (minutes || !parts.length) {
      parts.push(`${minutes} \u043C\u0438\u043D`);
    }
    return parts.join(" ");
  }

  // js/charts.js
  function emptyOption(title, message) {
    return {
      title: {
        text: title,
        left: 18,
        top: 12,
        textStyle: {
          fontSize: 15,
          color: "#1a2a33",
          fontWeight: 700
        }
      },
      graphic: {
        type: "text",
        left: "center",
        top: "middle",
        style: {
          text: message,
          fill: "#5d6d74",
          font: "15px Aptos, Segoe UI, sans-serif",
          textAlign: "center"
        }
      }
    };
  }
  function sharedGrid() {
    return {
      top: 64,
      left: 54,
      right: 24,
      bottom: 54,
      containLabel: true
    };
  }
  function createCharts({
    timelineEl,
    heatmapEl,
    scatterEl,
    weatherEl,
    onRowSelect
  }) {
    const timelineChart = window.echarts.init(timelineEl, null, { renderer: "canvas" });
    const heatmapChart = heatmapEl ? window.echarts.init(heatmapEl, null, { renderer: "canvas" }) : null;
    const scatterChart = window.echarts.init(scatterEl, null, { renderer: "canvas" });
    const weatherChart = weatherEl ? window.echarts.init(weatherEl, null, { renderer: "canvas" }) : null;
    timelineChart.on("click", (params) => {
      const rowId = Array.isArray(params == null ? void 0 : params.data) ? params.data[2] : null;
      if (rowId) {
        onRowSelect == null ? void 0 : onRowSelect(rowId);
      }
    });
    if (heatmapChart) {
      heatmapChart.on("click", (params) => {
        var _a;
        const rowId = (_a = params == null ? void 0 : params.data) == null ? void 0 : _a[3];
        if (rowId) {
          onRowSelect == null ? void 0 : onRowSelect(rowId);
        }
      });
    }
    scatterChart.on("click", (params) => {
      const rowId = Array.isArray(params == null ? void 0 : params.data) ? params.data[2] : null;
      if (rowId) {
        onRowSelect == null ? void 0 : onRowSelect(rowId);
      }
    });
    function updateTimeline({
      rows,
      metricKeys,
      metricCatalog,
      getMetricValueForKey,
      getMetricUnitForKey,
      selectedRowId,
      subtitle = ""
    }) {
      if (!rows.length || !metricKeys.length) {
        timelineChart.setOption(
          emptyOption("\u0421\u0438\u0433\u043D\u0430\u043B\u044B \u0432\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438", "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 CSV \u0438\u043B\u0438 \u0440\u0430\u0441\u0448\u0438\u0440\u044C\u0442\u0435 \u0444\u0438\u043B\u044C\u0442\u0440"),
          true
        );
        return;
      }
      const series = metricKeys.map((metricKey, index) => {
        const metricMeta = metricCatalog.find((item) => item.key === metricKey);
        if (!metricMeta) {
          return null;
        }
        const unit = getMetricUnitForKey(metricKey);
        const data = rows.map((row) => [
          row.timestamp.getTime(),
          getMetricValueForKey(row, metricKey),
          row.id
        ]);
        return {
          name: `${metricMeta.label}${unit ? `, ${unit}` : ""}`,
          type: "line",
          smooth: 0.08,
          symbol: "none",
          showSymbol: false,
          connectNulls: false,
          emphasis: { focus: "series" },
          lineStyle: {
            width: metricKey === metricKeys[0] ? 2.7 : 1.6,
            opacity: metricKey === metricKeys[0] ? 0.96 : 0.72
          },
          data,
          color: CHART_PALETTE[index % CHART_PALETTE.length]
        };
      }).filter(Boolean);
      const selectedRow = rows.find((row) => row.id === selectedRowId);
      timelineChart.setOption(
        {
          animation: false,
          color: CHART_PALETTE,
          title: {
            text: "\u0421\u0438\u0433\u043D\u0430\u043B\u044B \u0432\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438",
            left: 18,
            top: 12,
            textStyle: {
              fontSize: 15,
              color: "#1a2a33",
              fontWeight: 700
            },
            subtext: subtitle || `${rows.length} \u0441\u0442\u0440\u043E\u043A \u0432 \u0442\u0435\u043A\u0443\u0449\u0435\u043C \u0441\u0440\u0435\u0437\u0435`,
            subtextStyle: {
              color: "#5d6d74"
            }
          },
          grid: sharedGrid(),
          legend: {
            top: 14,
            right: 18,
            itemWidth: 14,
            textStyle: {
              color: "#5d6d74"
            }
          },
          tooltip: {
            trigger: "axis",
            borderWidth: 0,
            backgroundColor: "rgba(16, 31, 41, 0.92)",
            textStyle: {
              color: "#fdfdfb"
            },
            valueFormatter: (value) => formatNumber(value, 3)
          },
          toolbox: {
            right: 16,
            bottom: 10,
            feature: {
              dataZoom: { yAxisIndex: "none" },
              brush: { type: ["lineX", "clear"] },
              restore: {},
              saveAsImage: {}
            },
            iconStyle: {
              borderColor: "#50737f"
            }
          },
          brush: {
            xAxisIndex: "all",
            brushStyle: {
              color: "rgba(15, 143, 134, 0.15)",
              borderColor: "rgba(15, 143, 134, 0.55)"
            }
          },
          xAxis: {
            type: "time",
            axisLabel: {
              color: "#5d6d74"
            },
            axisLine: {
              lineStyle: {
                color: "rgba(28, 56, 69, 0.15)"
              }
            }
          },
          yAxis: {
            type: "value",
            scale: true,
            axisLabel: {
              color: "#5d6d74"
            },
            splitLine: {
              lineStyle: {
                color: "rgba(28, 56, 69, 0.08)"
              }
            }
          },
          dataZoom: [
            {
              type: "inside",
              filterMode: "weakFilter"
            },
            {
              type: "slider",
              height: 22,
              bottom: 18,
              brushSelect: false
            }
          ],
          series
        },
        true
      );
      if (selectedRow) {
        timelineChart.setOption({
          xAxis: {
            axisPointer: {
              value: selectedRow.timestamp.getTime(),
              snap: true
            }
          }
        });
      }
    }
    function updateHeatmap({
      rows,
      metricKeys,
      metricCatalog,
      getMetricValueForKey
    }) {
      if (!heatmapChart) {
        return;
      }
      if (!rows.length || !metricKeys.length) {
        heatmapChart.setOption(
          emptyOption("\u0418\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u043E\u0441\u0442\u044C \u043F\u043E \u0441\u0435\u043D\u0441\u043E\u0440\u0430\u043C", "\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F heatmap"),
          true
        );
        return;
      }
      const xLabels = rows.map((row) => row.datetimeText);
      const yLabels = metricKeys.map((metricKey) => {
        const metricMeta = metricCatalog.find((item) => item.key === metricKey);
        return (metricMeta == null ? void 0 : metricMeta.label) || metricKey;
      });
      const heatmapData = [];
      metricKeys.forEach((metricKey, yIndex) => {
        const values = rows.map((row) => getMetricValueForKey(row, metricKey)).filter((value) => Number.isFinite(value));
        const min = values.length ? Math.min(...values) : null;
        const max = values.length ? Math.max(...values) : null;
        rows.forEach((row, xIndex) => {
          const value = getMetricValueForKey(row, metricKey);
          const normalized = Number.isFinite(value) && Number.isFinite(min) && Number.isFinite(max) && min !== max ? (value - min) / (max - min) : Number.isFinite(value) ? 1 : null;
          heatmapData.push([
            xIndex,
            yIndex,
            normalized,
            row.id,
            value,
            row.datetimeText
          ]);
        });
      });
      heatmapChart.setOption(
        {
          animation: false,
          title: {
            text: "\u0418\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u043E\u0441\u0442\u044C \u043F\u043E \u0441\u0435\u043D\u0441\u043E\u0440\u0430\u043C",
            left: 18,
            top: 12,
            textStyle: {
              fontSize: 15,
              color: "#1a2a33",
              fontWeight: 700
            },
            subtext: "\u041D\u043E\u0440\u043C\u0430\u043B\u0438\u0437\u043E\u0432\u0430\u043D\u043D\u0430\u044F \u0438\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u043E\u0441\u0442\u044C \u0432\u043D\u0443\u0442\u0440\u0438 \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0441\u0438\u0433\u043D\u0430\u043B\u0430",
            subtextStyle: {
              color: "#5d6d74"
            }
          },
          tooltip: {
            position: "top",
            borderWidth: 0,
            backgroundColor: "rgba(16, 31, 41, 0.92)",
            textStyle: {
              color: "#fdfdfb"
            },
            formatter: (params) => {
              const [, yIndex, normalized, , rawValue, timeLabel] = params.data;
              return `${yLabels[yIndex]}<br>${timeLabel}<br>\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435: ${formatNumber(
                rawValue,
                3
              )}<br>\u041D\u043E\u0440\u043C\u0430: ${formatNumber((normalized != null ? normalized : 0) * 100, 1)}%`;
            }
          },
          grid: {
            top: 72,
            left: 92,
            right: 28,
            bottom: 52
          },
          xAxis: {
            type: "category",
            data: xLabels,
            axisLabel: {
              color: "#5d6d74",
              formatter: (value, index) => index % Math.max(1, Math.floor(rows.length / 8)) ? "" : value.slice(5, 16)
            },
            axisLine: {
              lineStyle: {
                color: "rgba(28, 56, 69, 0.15)"
              }
            }
          },
          yAxis: {
            type: "category",
            data: yLabels,
            axisLabel: {
              color: "#5d6d74"
            },
            axisLine: {
              lineStyle: {
                color: "rgba(28, 56, 69, 0.15)"
              }
            }
          },
          visualMap: {
            min: 0,
            max: 1,
            orient: "horizontal",
            left: 18,
            bottom: 10,
            calculable: false,
            text: ["\u0418\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u0435\u0435", "\u0421\u043B\u0430\u0431\u0435\u0435"],
            inRange: {
              color: ["#e6eceb", "#8dcbb2", "#2f9e93", "#e29b2f", "#c34f37"]
            },
            textStyle: {
              color: "#5d6d74"
            }
          },
          series: [
            {
              type: "heatmap",
              data: heatmapData,
              progressive: 0,
              itemStyle: {
                borderColor: "rgba(255,255,255,0.12)",
                borderWidth: 1
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 8,
                  shadowColor: "rgba(18, 28, 35, 0.25)"
                }
              }
            }
          ]
        },
        true
      );
    }
    function updateScatter({
      rows,
      xMetric,
      yMetric,
      metricCatalog,
      getMetricValueForKey,
      activeMetricKey
    }) {
      const xMeta = metricCatalog.find((item) => item.key === xMetric);
      const yMeta = metricCatalog.find((item) => item.key === yMetric);
      if (!rows.length || !xMeta || !yMeta) {
        scatterChart.setOption(
          emptyOption("\u041A\u043E\u0440\u0440\u0435\u043B\u044F\u0446\u0438\u0438", "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0432\u0435 \u043C\u0435\u0442\u0440\u0438\u043A\u0438 \u0441 \u0447\u0438\u0441\u043B\u043E\u0432\u044B\u043C\u0438 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F\u043C\u0438"),
          true
        );
        return;
      }
      const activeValues = rows.map((row) => getMetricValueForKey(row, activeMetricKey)).filter((value) => Number.isFinite(value));
      const activeMin = activeValues.length ? Math.min(...activeValues) : null;
      const activeMax = activeValues.length ? Math.max(...activeValues) : null;
      const colorScale = createColorScale(
        ["#0f4c5c", "#2db0a7", "#f0d06b", "#cf5537"],
        activeMin,
        activeMax
      );
      const pairs = [];
      const scatterData = [];
      for (const row of rows) {
        const xValue = getMetricValueForKey(row, xMetric);
        const yValue = getMetricValueForKey(row, yMetric);
        if (!Number.isFinite(xValue) || !Number.isFinite(yValue)) {
          continue;
        }
        pairs.push([xValue, yValue]);
        const activeValue = getMetricValueForKey(row, activeMetricKey);
        scatterData.push({
          value: [xValue, yValue, row.id],
          itemStyle: {
            color: Number.isFinite(activeValue) ? colorScale(activeValue) : "#7c5f86"
          },
          meta: row
        });
      }
      if (!scatterData.length) {
        scatterChart.setOption(
          emptyOption("\u041A\u043E\u0440\u0440\u0435\u043B\u044F\u0446\u0438\u0438", "\u041F\u043E\u0441\u043B\u0435 \u0444\u0438\u043B\u044C\u0442\u0440\u0430\u0446\u0438\u0438 \u043D\u0435 \u043E\u0441\u0442\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0432\u043C\u0435\u0441\u0442\u043D\u044B\u0445 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439"),
          true
        );
        return;
      }
      const correlation = pearsonCorrelation(pairs);
      scatterChart.setOption(
        {
          animation: false,
          title: {
            text: "\u041A\u043E\u0440\u0440\u0435\u043B\u044F\u0446\u0438\u0438",
            left: 18,
            top: 12,
            textStyle: {
              fontSize: 15,
              color: "#1a2a33",
              fontWeight: 700
            },
            subtext: `${xMeta.label} \xD7 ${yMeta.label} \xB7 r = ${formatNumber(
              correlation,
              3
            )}`,
            subtextStyle: {
              color: "#5d6d74"
            }
          },
          grid: sharedGrid(),
          tooltip: {
            borderWidth: 0,
            backgroundColor: "rgba(16, 31, 41, 0.92)",
            textStyle: {
              color: "#fdfdfb"
            },
            formatter: (params) => {
              const row = params.data.meta;
              return `${row.datetimeText}<br>${xMeta.label}: ${formatNumber(
                params.value[0],
                3
              )}<br>${yMeta.label}: ${formatNumber(params.value[1], 3)}`;
            }
          },
          xAxis: {
            type: "value",
            name: xMeta.label,
            nameLocation: "middle",
            nameGap: 28,
            axisLabel: {
              color: "#5d6d74"
            },
            splitLine: {
              lineStyle: {
                color: "rgba(28, 56, 69, 0.08)"
              }
            }
          },
          yAxis: {
            type: "value",
            name: yMeta.label,
            nameLocation: "middle",
            nameGap: 42,
            axisLabel: {
              color: "#5d6d74"
            },
            splitLine: {
              lineStyle: {
                color: "rgba(28, 56, 69, 0.08)"
              }
            }
          },
          series: [
            {
              type: "scatter",
              symbolSize: 10,
              data: scatterData,
              emphasis: {
                scale: 1.25
              }
            }
          ]
        },
        true
      );
    }
    function updateWeather({ rows }) {
      if (!weatherChart) {
        return;
      }
      const weatherRows = rows.filter(
        (row) => Number.isFinite(row.values.TempC) || Number.isFinite(row.values.Hum)
      );
      if (!weatherRows.length) {
        weatherChart.setOption(
          emptyOption("\u041F\u043E\u0433\u043E\u0434\u0430 \u0438 \u0432\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C", "\u0412 \u0442\u0435\u043A\u0443\u0449\u0435\u043C \u0441\u0440\u0435\u0437\u0435 \u043D\u0435\u0442 \u0432\u0430\u043B\u0438\u0434\u043D\u043E\u0439 \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u044B \u0438 \u0432\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u0438"),
          true
        );
        return;
      }
      weatherChart.setOption(
        {
          animation: false,
          title: {
            text: "\u041F\u043E\u0433\u043E\u0434\u0430 \u0438 \u0432\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C",
            left: 18,
            top: 12,
            textStyle: {
              fontSize: 15,
              color: "#1a2a33",
              fontWeight: 700
            },
            subtext: `${weatherRows.length} \u0441\u0442\u0440\u043E\u043A \u0441 \u043F\u043E\u0433\u043E\u0434\u043E\u0439`,
            subtextStyle: {
              color: "#5d6d74"
            }
          },
          grid: sharedGrid(),
          legend: {
            top: 14,
            right: 18,
            textStyle: {
              color: "#5d6d74"
            }
          },
          tooltip: {
            trigger: "axis",
            borderWidth: 0,
            backgroundColor: "rgba(16, 31, 41, 0.92)",
            textStyle: {
              color: "#fdfdfb"
            }
          },
          xAxis: {
            type: "time",
            axisLabel: {
              color: "#5d6d74"
            }
          },
          yAxis: [
            {
              type: "value",
              name: "\xB0C",
              axisLabel: {
                color: "#5d6d74"
              },
              splitLine: {
                lineStyle: {
                  color: "rgba(28, 56, 69, 0.08)"
                }
              }
            },
            {
              type: "value",
              name: "%RH",
              axisLabel: {
                color: "#5d6d74"
              },
              splitLine: {
                show: false
              }
            }
          ],
          series: [
            {
              name: "\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430",
              type: "line",
              yAxisIndex: 0,
              smooth: 0.2,
              symbol: "none",
              data: weatherRows.map((row) => [row.timestamp.getTime(), row.values.TempC, row.id]),
              lineStyle: { width: 2.4 },
              color: "#dd8d31"
            },
            {
              name: "\u0412\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C",
              type: "line",
              yAxisIndex: 1,
              smooth: 0.2,
              symbol: "none",
              data: weatherRows.map((row) => [row.timestamp.getTime(), row.values.Hum, row.id]),
              lineStyle: { width: 2.2 },
              color: "#0f8f86"
            },
            {
              name: "\u0422\u043E\u0447\u043A\u0430 \u0440\u043E\u0441\u044B",
              type: "line",
              yAxisIndex: 0,
              smooth: 0.2,
              symbol: "none",
              data: weatherRows.map((row) => [
                row.timestamp.getTime(),
                row.derived.dewPoint,
                row.id
              ]),
              lineStyle: { width: 1.6, type: "dashed" },
              color: "#465fbc"
            }
          ]
        },
        true
      );
    }
    return {
      resize() {
        timelineChart.resize();
        if (heatmapChart) {
          heatmapChart.resize();
        }
        scatterChart.resize();
        if (weatherChart) {
          weatherChart.resize();
        }
      },
      updateTimeline,
      updateHeatmap,
      updateScatter,
      updateWeather
    };
  }

  // js/embeddedMonitorCsv.js
  var EMBEDDED_MONITOR_CSV = "datetime,MQ-2,MQ-3,MQ-4,MQ-5,MQ-6,MQ-7,MQ-8,MQ-9,MQ-135,WindDirRaw,WindSpeedRaw,TempC,Hum,Lat,Lon,Sats\n2026-04-20 08:00:00,10603,7429,7177,13783,15917,15118,6829,3428,3318,26644,330,18.07,72,45.045383,38.984302,11\n2026-04-20 08:00:15,10535,7357,7342,13102,15586,15020,6603,3447,3249,26663,317,17.71,70,45.047104,38.983247,9\n2026-04-20 08:00:30,10583,7171,7369,13478,15831,14870,6649,3374,3257,26592,301,17.86,73,45.046773,38.982899,11\n2026-04-20 08:00:45,10462,7374,7252,13459,15904,15116,6865,3436,3308,26663,328,18.18,69,45.047250,38.980220,12\n2026-04-20 08:01:00,10549,7110,7008,13328,15302,15217,6547,3387,3274,26663,372,17.85,73,45.048591,38.980713,10\n2026-04-20 08:01:15,10359,7117,7104,13121,15709,15069,6639,3448,3290,26663,325,17.84,69,45.048348,38.978626,9\n2026-04-20 08:01:30,10594,7205,7069,13490,15192,15251,6738,3468,3239,26634,350,18.06,73,45.049078,38.976921,11\n2026-04-20 08:01:45,10303,7268,7145,13247,15675,15251,6482,3451,3182,26621,338,18.23,70,45.048911,38.976580,11\n2026-04-20 08:02:00,10159,7304,7039,12985,15484,14911,6582,3424,3241,26663,324,18.28,70,45.049977,38.976399,12\n2026-04-20 08:02:15,10335,7186,6963,13567,15650,14998,6727,3444,3197,26663,366,18.12,70,45.049740,38.975061,12\n2026-04-20 08:02:30,10397,7397,7175,12987,15361,15062,6569,3363,3120,26663,332,18.31,73,45.049917,38.972703,11\n2026-04-20 08:02:45,10401,7341,6940,12960,15466,15290,6554,3458,3146,26656,355,18.30,72,45.051440,38.971326,11\n2026-04-20 08:03:00,10045,7132,6960,13414,15382,14814,6410,3473,3075,26663,358,18.26,69,45.051838,38.971043,10\n2026-04-20 08:03:15,10473,7208,7125,13069,15155,14805,6662,3487,3134,26663,341,18.30,73,45.051573,38.969170,12\n2026-04-20 08:03:30,10016,7071,6996,13025,15048,14816,6607,3502,3091,26651,321,18.40,69,45.051687,38.969059,11\n2026-04-20 08:03:45,10411,7315,7040,13342,15362,15131,6373,3490,3108,26663,347,18.58,70,45.052369,38.968250,10\n2026-04-20 08:04:00,10051,6976,7058,13195,15291,14838,6534,3388,3039,26619,393,18.41,72,45.053099,38.967331,10\n2026-04-20 08:04:15,9957,7056,7062,12969,15272,14899,6633,3476,3068,26606,364,18.61,73,45.052559,38.966233,11\n2026-04-20 08:04:30,10022,7104,7081,13202,15046,15302,6329,3379,3033,26595,389,18.41,70,45.053153,38.964880,9\n2026-04-20 08:04:45,10105,7166,6867,13088,15153,15097,6406,3396,2985,26663,364,18.45,73,45.054728,38.963825,10\n2026-04-20 08:05:00,10091,7209,6928,13126,15458,15175,6261,3407,3003,26649,334,18.72,73,45.054564,38.962615,11\n2026-04-20 08:05:15,10201,6943,6966,12771,15283,14986,6456,3381,2956,26608,358,18.54,71,45.054382,38.961331,10\n2026-04-20 08:05:30,10044,7022,6773,12661,15339,15105,6444,3434,2939,26608,364,18.79,69,45.055159,38.959749,10\n2026-04-20 08:05:45,10110,7096,6753,12992,15047,14951,6167,3338,2917,26622,371,18.86,70,45.056072,38.958874,11\n2026-04-20 08:06:00,10117,7139,6903,12979,15315,15121,6438,3439,2927,26663,388,18.64,72,45.056054,38.957508,12\n2026-04-20 08:06:15,9758,7025,6822,12945,15038,15039,6218,3342,2955,26651,381,18.82,72,45.055692,38.955641,11\n2026-04-20 08:06:30,9988,6885,6644,12679,15067,14881,6273,3404,2853,26648,341,18.97,69,45.056587,38.956104,10\n2026-04-20 08:06:45,9939,7001,6578,12877,15228,14719,6266,3359,2807,26599,392,18.83,70,45.056459,38.953573,10\n2026-04-20 08:07:00,9922,7067,6549,12587,14861,14563,6180,3375,2884,26646,355,18.78,71,45.056937,38.952584,12\n2026-04-20 08:07:15,9936,6973,6736,12880,15171,14921,6229,3425,2836,26625,406,18.98,70,45.056851,38.952218,10\n2026-04-20 08:07:30,9847,6877,6595,12328,14940,14856,6132,3269,2841,26640,347,19.19,72,45.058622,38.951446,10\n2026-04-20 08:07:45,9615,6769,6611,12673,14986,14636,6156,3288,2742,26663,406,19.10,71,45.059153,38.950730,11\n2026-04-20 08:08:00,9805,6931,6377,12530,14743,14416,5985,3304,2739,26638,390,19.25,70,45.058386,38.948577,10\n2026-04-20 08:08:15,9573,6833,6534,12697,14555,14842,6086,3274,2722,26625,416,19.36,70,45.059049,38.948533,11\n2026-04-20 08:08:30,9453,6896,6593,12517,14996,14563,6127,3347,2688,26598,369,19.21,70,45.059281,38.947475,9\n2026-04-20 08:08:45,9187,6929,6202,12315,14294,14663,6065,3177,2641,26643,394,19.22,71,45.060774,38.946228,11\n2026-04-20 08:09:00,9156,6899,6330,12455,14700,14461,5844,3268,2692,26663,393,19.20,70,45.060841,38.944286,12\n2026-04-20 08:09:15,9300,6757,6411,12442,14233,14356,5866,3155,2657,26663,410,19.16,71,45.061072,38.943062,12\n2026-04-20 08:09:30,9328,6744,6133,12055,14436,14386,5804,3171,2628,26603,387,19.28,70,45.061173,38.943504,11\n2026-04-20 08:09:45,9264,6785,6073,12311,14320,14415,5898,3117,2585,26594,379,19.45,70,45.062053,38.941190,10\n2026-04-20 08:10:00,9255,6853,6352,12261,14440,14387,5888,3203,2588,26663,355,19.29,68,45.061565,38.941824,11\n2026-04-20 08:10:15,9368,6628,6056,12173,14622,14367,5860,3202,2559,26663,425,19.42,68,45.061911,38.940551,12\n2026-04-20 08:10:30,9248,6451,6008,11940,14147,14193,5693,3222,2522,26642,419,19.38,68,45.062966,38.939122,12\n2026-04-20 08:10:45,9249,6636,5990,11655,14320,14225,5887,3122,2572,26625,413,19.66,70,45.063125,38.937476,12\n2026-04-20 08:11:00,8965,6502,6021,11939,14532,13857,5775,3102,2521,26648,423,19.80,71,45.063806,38.938052,12\n2026-04-20 08:11:15,8750,6505,5870,11586,14275,13809,5742,3167,2452,26649,378,19.76,71,45.064311,38.936777,10\n2026-04-20 08:11:30,8783,6373,5841,11807,14437,13796,5907,3018,2492,26607,439,19.81,69,45.064092,38.934579,10\n2026-04-20 08:11:45,8794,6518,5916,11895,14329,13552,5768,3075,2477,22810,402,19.55,70,45.064674,38.933779,11\n2026-04-20 08:12:00,8836,6487,5841,11671,14041,13823,5817,3077,2372,26663,435,19.72,70,45.066381,38.932956,13\n2026-04-20 08:12:15,8751,6597,5700,11728,13903,13911,5643,2995,2442,22748,420,19.68,72,45.066125,38.932702,10\n2026-04-20 08:12:30,8685,6258,5812,11736,13875,13473,5828,3011,2418,26601,420,19.96,67,45.066274,38.930815,10\n2026-04-20 08:12:45,8487,6419,5829,11398,13798,13505,5675,2992,2396,26605,395,19.78,70,45.066715,38.930002,11\n2026-04-20 08:13:00,8665,6268,5812,11676,13706,13827,5747,2913,2356,26663,373,19.83,67,45.068128,38.929967,10\n2026-04-20 08:13:15,8352,6429,5519,11616,14118,13600,5580,2974,2341,26663,404,19.76,68,45.067362,38.928115,11\n2026-04-20 08:13:30,8531,6194,5585,11207,13578,13477,5648,2951,2293,26655,379,19.97,69,45.068607,38.927209,12\n2026-04-20 08:13:45,8667,6222,5531,11477,13467,13269,5616,2889,2309,22790,430,20.08,67,45.068317,38.926477,10\n2026-04-20 08:14:00,8189,6187,5614,11153,13689,13375,5525,2898,2284,22800,394,19.94,68,45.069190,38.926340,10\n2026-04-20 08:14:15,8455,6334,5461,11050,13654,13141,5324,2823,2195,26663,428,19.90,68,45.069947,38.925469,11\n2026-04-20 08:14:30,8452,6115,5561,10976,13684,13020,5574,2853,2251,22740,383,20.34,67,45.069290,38.922809,11\n2026-04-20 08:14:45,7997,6151,5395,10935,13423,12865,5342,2936,2229,22729,380,19.96,69,45.069871,38.921867,12\n2026-04-20 08:15:00,8078,5997,5507,11129,13430,13178,5301,2918,2167,26663,408,20.33,68,45.070744,38.922352,10\n2026-04-20 08:15:15,8209,6119,5406,11227,13888,13239,5452,2822,2147,26663,373,20.20,66,45.070204,38.920879,11\n2026-04-20 08:15:30,8313,6008,5222,10933,13412,13156,5261,2745,2148,22858,393,20.11,66,45.070748,38.919117,12\n2026-04-20 08:15:45,8084,6196,5244,10751,13542,12810,5260,2811,2169,22788,376,20.42,67,45.071365,38.919340,11\n2026-04-20 08:16:00,8223,6066,5048,10928,13699,13070,5182,2805,2140,22753,372,20.38,68,45.071558,38.916716,11\n2026-04-20 08:16:15,8143,6204,5009,10935,13449,12620,5450,2846,2099,22736,404,20.50,69,45.071940,38.916837,10\n2026-04-20 08:16:30,7978,5846,5003,10766,13289,13001,5182,2748,2029,22855,391,20.57,66,45.071712,38.914833,11\n2026-04-20 08:16:45,8058,6088,5256,11031,13319,12625,5375,2753,2029,22840,395,20.28,67,45.071567,38.914138,13\n2026-04-20 08:17:00,7671,5817,4914,10705,13075,12480,5269,2784,2019,22868,434,20.51,66,45.072833,38.913134,12\n2026-04-20 08:17:15,7617,6060,5190,10654,13503,12408,5122,2793,2055,26663,399,20.49,67,45.072547,38.912480,10\n2026-04-20 08:17:30,7930,5903,4910,10365,12905,12838,5249,2721,2046,22829,435,20.38,70,45.072525,38.911752,12\n2026-04-20 08:17:45,7959,5957,4942,10821,13337,12557,5349,2651,2035,22734,434,20.60,69,45.073041,38.910546,11\n2026-04-20 08:18:00,7803,5964,5067,10285,13149,12645,5224,2661,1993,22846,405,20.84,67,45.073322,38.909354,12\n2026-04-20 08:18:15,7651,6008,4936,10575,12761,12376,5026,2700,1990,22771,450,20.60,67,45.074889,38.909790,12\n2026-04-20 08:18:30,7987,5916,4869,10695,13198,12475,5168,2594,1913,22729,422,20.60,66,45.074475,38.910516,11\n2026-04-20 08:18:45,7616,5764,4952,10377,13099,12450,5267,2746,1919,22856,430,20.69,69,45.075695,38.912236,10\n2026-04-20 08:19:00,7576,6036,4892,10146,12775,12431,5342,2692,2018,26663,411,20.97,67,45.075242,38.911412,11\n2026-04-20 08:19:15,7695,5793,4648,10507,13147,12312,5247,2595,1999,26663,425,20.85,68,45.076810,38.912188,11\n2026-04-20 08:19:30,7542,5888,4986,10586,12963,12882,5253,2762,1964,22731,425,20.82,67,45.076058,38.913950,12\n2026-04-20 08:19:45,7793,5975,4937,10656,13292,12532,5319,2673,2020,22827,439,20.72,65,45.076733,38.914263,12\n2026-04-20 08:20:00,7885,5814,4805,10129,12853,12529,5175,2707,1932,22806,421,20.94,65,45.078462,38.914957,11\n2026-04-20 08:20:15,7590,5893,4808,10309,13083,12880,5257,2691,1993,22780,428,20.93,67,45.078356,38.916452,13\n2026-04-20 08:20:30,7823,5833,4985,10125,13220,12507,5358,2687,1976,22867,405,21.12,65,45.078688,38.917336,10\n2026-04-20 08:20:45,7830,5821,4644,10563,13137,12444,5001,2735,2021,22834,424,20.90,66,45.079969,38.917858,12\n2026-04-20 08:21:00,7872,5847,4860,10262,12705,12590,5294,2747,1967,22833,423,21.02,67,45.080326,38.917498,11\n2026-04-20 08:21:15,7547,6124,4782,10057,12568,12605,5327,2736,2003,22822,448,21.23,65,45.081596,38.918908,12\n2026-04-20 08:21:30,7523,6059,4590,10236,13017,12741,5324,2705,1979,22820,462,21.32,65,45.081796,38.919355,13\n2026-04-20 08:21:45,7699,6000,4727,10394,13091,12490,5105,2671,1949,22797,389,21.13,68,45.081493,38.920436,13\n2026-04-20 08:22:00,7544,5879,4689,9919,13028,12698,5073,2601,1954,22774,424,21.42,68,45.083346,38.922008,11\n2026-04-20 08:22:15,7802,6031,4755,10020,12835,12753,5298,2754,2004,22867,452,21.35,68,45.083921,38.922748,12\n2026-04-20 08:22:30,7365,6108,4578,10025,12531,12635,5068,2656,1988,22770,434,21.34,68,45.084907,38.922788,11\n2026-04-20 08:22:45,7548,6021,4485,10309,12810,12708,5096,2606,1992,22817,449,21.45,67,45.085648,38.924332,12\n2026-04-20 08:23:00,7779,5829,4606,9800,12601,12550,5256,2620,2016,22753,441,21.32,66,45.085897,38.924035,11\n2026-04-20 08:23:15,7552,5974,4626,9897,12642,12726,5085,2725,2038,22784,464,21.53,67,45.086092,38.926131,12\n2026-04-20 08:23:30,7461,6140,4712,9859,12874,12905,5276,2634,2026,22762,403,21.70,65,45.086999,38.926738,10\n2026-04-20 08:23:45,7665,5962,4429,9888,12385,12740,5054,2701,1997,22814,428,21.40,66,45.087710,38.926645,11\n2026-04-20 08:24:00,7448,5966,4414,9813,12737,12533,5093,2649,2047,22794,418,21.60,67,45.087790,38.929177,13\n2026-04-20 08:24:15,7358,6049,4593,9817,12365,12609,5032,2648,1942,22805,423,21.65,67,45.089744,38.930090,10\n2026-04-20 08:24:30,7562,5939,4387,10051,12676,13022,5224,2614,1949,22818,442,21.78,65,45.089263,38.929999,12\n2026-04-20 08:24:45,7308,6014,4570,9671,12830,12636,5083,2688,2014,22842,468,21.79,67,45.090307,38.930809,12\n2026-04-20 08:25:00,7297,5834,4461,9771,12415,12819,5196,2634,2012,22760,449,21.79,67,45.091029,38.931802,10\n2026-04-20 08:25:15,7628,5784,4382,10053,12238,12870,5213,2686,1942,22792,458,21.89,65,45.092532,38.933603,12\n2026-04-20 08:25:30,7665,5821,4424,9540,12801,12990,4930,2559,2020,22771,437,21.72,65,45.093044,38.934086,11\n2026-04-20 08:25:45,7215,5976,4406,9678,12446,12450,5135,2687,1951,22746,424,21.91,67,45.094519,38.935726,11\n2026-04-20 08:26:00,7424,5797,4214,9868,12354,12857,5169,2571,1914,22747,465,21.99,66,45.094122,38.935656,11\n2026-04-20 08:26:15,7118,6079,4123,9546,12781,12406,5011,2555,1902,22802,473,21.75,67,45.095688,38.936949,12\n2026-04-20 08:26:30,7133,6053,4356,9656,12139,12733,5047,2566,1929,19053,413,22.02,65,45.096254,38.938216,11\n2026-04-20 08:26:45,7406,5826,4311,9680,12095,12590,4986,2684,1972,22799,439,21.84,68,45.096828,38.938944,12\n2026-04-20 08:27:00,7266,6032,4083,9504,12563,12850,4858,2651,1957,22742,465,22.03,66,45.097970,38.939547,12\n2026-04-20 08:27:15,7080,5785,4255,9445,12195,12440,4875,2549,1940,22823,426,22.07,67,45.097739,38.939910,10\n2026-04-20 08:27:30,7379,5863,4102,9447,12404,12495,5131,2564,1984,22791,438,22.00,66,45.098078,38.941622,12\n2026-04-20 08:27:45,7353,5813,3962,9255,12650,12562,5091,2546,1966,22771,408,22.29,63,45.100104,38.942355,11\n2026-04-20 08:28:00,7237,5743,3965,9321,12396,12765,4925,2606,1971,22734,412,22.16,66,45.100374,38.943800,13\n2026-04-20 08:28:15,7010,5841,3956,9388,12191,12371,5059,2629,1966,22757,427,21.94,64,45.100623,38.944406,11\n2026-04-20 08:28:30,6972,5709,3952,9245,12037,12680,5105,2573,1922,22866,466,22.06,66,45.102142,38.945502,11\n2026-04-20 08:28:45,7377,6007,4179,9631,12547,12528,5059,2518,1918,18941,439,22.22,65,45.102548,38.945058,12\n2026-04-20 08:29:00,7196,5949,4100,9134,12227,12594,4844,2613,1877,19045,416,22.24,65,45.102120,38.946742,12\n2026-04-20 08:29:15,6961,5868,3925,9243,12270,12527,5050,2484,1894,22776,422,22.09,66,45.103596,38.948138,12\n2026-04-20 08:29:30,6916,5952,4154,9411,12218,12340,4813,2523,1883,18930,423,22.26,66,45.103376,38.948845,12\n2026-04-20 08:29:45,7279,5813,4086,9301,12194,12346,4828,2536,1853,18982,437,22.16,65,45.103948,38.948337,10\n2026-04-20 08:30:00,7160,5751,3964,9190,12335,12255,5038,2577,1854,22859,432,22.51,64,45.104956,38.950434,10\n2026-04-20 08:30:15,6944,5933,3846,9294,11967,12607,4792,2483,1886,22870,416,22.27,66,45.106259,38.950344,11\n2026-04-20 08:30:30,6971,5945,3770,9542,11928,12704,5033,2440,1895,18981,405,22.36,63,45.106122,38.951583,12\n2026-04-20 08:30:45,7066,5858,4036,9521,12160,12646,4942,2561,1883,22743,458,22.35,66,45.106288,38.951633,12\n2026-04-20 08:31:00,7006,5718,3757,9287,11943,12408,4926,2409,1821,19017,419,22.36,65,45.108022,38.952591,13\n2026-04-20 08:31:15,6842,5685,3838,9425,12394,12196,4989,2433,1838,18980,440,22.52,65,45.107571,38.954315,13\n2026-04-20 08:31:30,6699,5706,3959,9207,11681,12016,4789,2490,1774,22848,447,22.70,62,45.109550,38.953527,13\n2026-04-20 08:31:45,6829,5592,3741,9324,12154,12190,4906,2394,1819,19052,445,22.63,62,45.110355,38.954878,12\n2026-04-20 08:32:00,6792,5901,3608,9225,11799,11959,4824,2369,1819,22868,462,22.51,64,45.110940,38.955424,11\n2026-04-20 08:32:15,6874,5934,3662,9168,11733,12053,4823,2412,1853,18954,424,22.77,64,45.110704,38.957055,12\n2026-04-20 08:32:30,6900,5756,3920,9195,11762,12243,4693,2484,1821,19037,449,22.53,62,45.111196,38.956787,12\n2026-04-20 08:32:45,7001,5746,3889,8927,11937,12258,4882,2454,1853,22764,427,22.82,62,45.111621,38.957582,13\n2026-04-20 08:33:00,6709,5639,3851,9107,12185,12225,4907,2377,1857,19034,471,22.53,63,45.112075,38.958757,13\n2026-04-20 08:33:15,6737,5601,3746,8640,11812,12073,4863,2389,1792,22755,446,22.90,64,45.114061,38.958756,11\n2026-04-20 08:33:30,6851,5739,3799,8757,11936,11949,4719,2482,1790,18985,429,22.69,62,45.113901,38.960145,13\n2026-04-20 08:33:45,6704,5847,3761,8697,12085,12260,4598,2311,1763,18988,418,22.64,63,45.115094,38.960428,11\n2026-04-20 08:34:00,6975,5767,3617,9079,11575,11832,4710,2436,1808,19029,404,23.00,64,45.115117,38.960453,12\n2026-04-20 08:34:15,6991,5572,3603,8696,11963,11696,4671,2315,1759,18988,406,22.83,63,45.116339,38.961328,11\n2026-04-20 08:34:30,6664,5730,3439,8827,12088,11713,4818,2409,1705,18974,456,22.69,65,45.116438,38.962663,12\n2026-04-20 08:34:45,6441,5612,3563,8472,11663,11673,4815,2359,1689,19002,401,23.05,63,45.118292,38.963640,11\n2026-04-20 08:35:00,6609,5594,3447,9050,11834,11896,4739,2363,1713,19040,458,23.15,62,45.117714,38.964164,11\n2026-04-20 08:35:15,6825,5622,3559,8870,11986,11892,4551,2268,1726,19071,404,22.99,65,45.119233,38.963703,12\n2026-04-20 08:35:30,6481,5668,3481,8772,11709,11679,4741,2385,1703,19052,432,22.99,65,45.120668,38.965012,10\n2026-04-20 08:35:45,6433,5495,3450,8617,11700,11609,4752,2281,1705,18946,412,23.15,63,45.121393,38.965933,11\n2026-04-20 08:36:00,6476,5691,3571,8866,11518,11636,4623,2273,1703,18968,447,23.05,64,45.121398,38.965711,12\n2026-04-20 08:36:15,6829,5421,3506,8783,11815,11474,4721,2323,1687,18984,438,23.22,61,45.121785,38.968155,13\n2026-04-20 08:36:30,6531,5633,3625,8454,11638,12016,4513,2361,1706,19018,401,23.05,64,45.120332,38.970053,12\n2026-04-20 08:36:45,6632,5733,3624,8915,11489,11739,4655,2256,1725,18956,443,23.32,61,45.120535,38.970164,11\n2026-04-20 08:37:00,6869,5681,3643,8676,11476,11499,4611,2352,1755,18977,449,23.11,63,45.120509,38.972117,11\n2026-04-20 08:37:15,6640,5515,3531,8629,11481,11544,4794,2278,1725,19007,428,23.33,60,45.120628,38.974431,11\n2026-04-20 08:37:30,6711,5720,3602,8829,11537,11942,4629,2422,1753,18962,408,23.18,64,45.119399,38.974397,12\n2026-04-20 08:37:45,6893,5796,3580,8504,11802,11751,4868,2371,1753,18983,419,23.04,61,45.119866,38.977345,10\n2026-04-20 08:38:00,6938,5765,3422,8926,11888,11625,4883,2417,1732,18953,424,23.17,62,45.119768,38.977356,11\n2026-04-20 08:38:15,6931,5825,3439,8860,11423,11970,4702,2394,1823,18941,404,23.27,62,45.118683,38.979012,12\n2026-04-20 08:38:30,6610,5749,3441,8798,11464,12200,4653,2340,1827,19065,392,23.53,61,45.118971,38.980842,12\n2026-04-20 08:38:45,6959,5764,3604,8654,11794,12059,4755,2332,1839,18936,417,23.20,64,45.118175,38.982752,13\n2026-04-20 08:39:00,6898,5734,3500,8539,11412,11933,4818,2414,1834,19023,445,23.37,62,45.119059,38.984454,12\n2026-04-20 08:39:15,6726,5845,3522,8702,11777,12062,4937,2344,1865,19011,417,23.36,60,45.117993,38.985749,11\n2026-04-20 08:39:30,6554,5614,3489,8960,11741,11921,4670,2357,1797,18963,394,23.38,64,45.118358,38.987238,10\n2026-04-20 08:39:45,6636,5593,3654,8712,12077,11743,4599,2422,1843,15274,390,23.61,63,45.118427,38.988372,12\n2026-04-20 08:40:00,6795,5867,3586,8549,12130,12259,4609,2425,1792,19031,393,23.42,63,45.117760,38.989510,11\n2026-04-20 08:40:15,7095,5950,3604,8718,12066,12270,4632,2471,1916,19058,396,23.67,64,45.116660,38.990635,12\n2026-04-20 08:40:30,6864,5725,3740,9144,11683,12404,4915,2497,1908,19064,441,23.70,61,45.116325,38.992395,11\n2026-04-20 08:40:45,7128,5798,3688,8922,12038,12058,4745,2416,1887,18969,397,23.55,62,45.115467,38.994671,11\n2026-04-20 08:41:00,6807,5872,3590,9073,11569,12409,4791,2393,1917,19075,374,23.42,61,45.115502,38.994985,11\n2026-04-20 08:41:15,6750,5859,3598,8868,11877,12334,4672,2519,1931,19008,438,23.82,61,45.115475,38.997995,13\n2026-04-20 08:41:30,7079,5909,3634,9114,11899,12187,4889,2360,1870,15227,404,23.86,60,45.115582,38.999114,13\n2026-04-20 08:41:45,6863,5717,3773,9010,11575,12500,4963,2504,1931,18966,403,23.71,62,45.114995,39.001252,13\n2026-04-20 08:42:00,6951,5897,3538,8908,11651,12532,4881,2508,1981,19006,403,23.61,63,45.114665,39.001503,13\n2026-04-20 08:42:15,7143,6023,3830,8806,11746,12041,4936,2458,2012,18988,439,23.74,61,45.113976,39.002728,11\n2026-04-20 08:42:30,6970,5815,3662,9041,11739,12211,4847,2568,1954,15153,380,23.79,62,45.112625,39.005329,11\n2026-04-20 08:42:45,7260,5980,3590,9097,12006,12366,4754,2426,1977,19014,396,23.75,62,45.112452,39.006201,12\n2026-04-20 08:43:00,6940,6080,3784,8910,12135,12112,5075,2454,2032,18982,434,23.98,60,45.113127,39.006988,11\n2026-04-20 08:43:15,6995,5878,3892,9165,12297,12498,4836,2421,2049,15260,383,23.97,62,45.112346,39.009627,11\n2026-04-20 08:43:30,7216,6092,3678,9255,11679,12479,4935,2472,2041,18930,428,23.80,60,45.112250,39.010263,13\n2026-04-20 08:43:45,7356,6115,3797,8977,11964,12508,5117,2589,2062,18941,442,23.85,60,45.110540,39.011777,11\n2026-04-20 08:44:00,7195,6091,3658,9125,12182,12439,5072,2567,2071,18982,419,24.09,61,45.110219,39.013108,10\n2026-04-20 08:44:15,7085,5926,3765,8827,11968,12313,5046,2546,2105,19055,422,23.83,63,45.110934,39.014894,12\n2026-04-20 08:44:30,7025,6224,3974,9338,12198,12295,4944,2583,2115,19043,410,23.77,62,45.109380,39.016373,10\n2026-04-20 08:44:45,7297,6012,3668,9226,11839,12208,4870,2515,2050,18964,362,24.09,61,45.109778,39.017276,11\n2026-04-20 08:45:00,6964,6218,3920,9398,12262,12642,5039,2567,2145,15132,427,23.97,62,45.109511,39.019846,11\n2026-04-20 08:45:15,7275,6096,3663,9388,12288,12457,5077,2498,2168,18927,390,23.99,60,45.109066,39.020901,11\n2026-04-20 08:45:30,7410,6298,3979,8938,12216,12229,4966,2513,2117,15139,393,23.88,59,45.108698,39.021337,11\n2026-04-20 08:45:45,7213,6252,3959,8932,12155,12343,4828,2492,2096,15274,378,23.86,60,45.108178,39.024003,11\n2026-04-20 08:46:00,7534,6421,3884,9186,11939,12519,5061,2471,2181,15190,382,24.07,60,45.106926,39.025458,13\n2026-04-20 08:46:15,7432,6398,3942,9425,11772,12409,5206,2576,2253,15257,405,24.26,61,45.106411,39.026580,13\n2026-04-20 08:46:30,7089,6321,3864,9322,11902,12690,5032,2616,2184,15252,409,24.28,62,45.106673,39.026950,10\n2026-04-20 08:46:45,7253,6314,3911,9237,12319,12363,5113,2556,2177,15163,389,24.32,60,45.106768,39.029322,11\n2026-04-20 08:47:00,7528,6375,3988,9503,12455,12745,4986,2536,2199,18935,374,24.02,59,45.105208,39.029916,13\n2026-04-20 08:47:15,7169,6293,4026,9506,12221,12609,4905,2555,2240,15174,367,23.97,60,45.105273,39.031848,11\n2026-04-20 08:47:30,7429,6431,4019,9138,12477,12546,5043,2566,2281,15193,365,24.16,59,45.104846,39.032308,11\n2026-04-20 08:47:45,7496,6498,3789,9513,12380,12677,4965,2474,2277,15138,354,23.98,62,45.104555,39.034739,11\n2026-04-20 08:48:00,7366,6650,4063,9089,12057,12492,5131,2531,2263,15275,371,24.30,57,45.103893,39.036059,10\n2026-04-20 08:48:15,7500,6353,3810,9252,11930,12339,5183,2482,2240,15228,340,24.24,62,45.103980,39.036871,11\n2026-04-20 08:48:30,7568,6615,3748,9140,12032,12489,5089,2458,2333,15139,418,24.05,60,45.103550,39.038132,12\n2026-04-20 08:48:45,7347,6592,3858,9261,12277,12403,4996,2549,2359,15160,351,24.28,60,45.102634,39.039227,12\n2026-04-20 08:49:00,7569,6688,3872,9427,12323,12482,5190,2471,2304,15256,405,24.29,60,45.102519,39.040785,12\n2026-04-20 08:49:15,7611,6490,4046,9285,12306,12569,5000,2591,2302,15182,347,24.50,57,45.102678,39.041926,12\n2026-04-20 08:49:30,7198,6638,3776,9177,11836,12412,5181,2458,2348,15142,347,24.09,59,45.102302,39.044982,12\n2026-04-20 08:49:45,7145,6650,3947,9004,11806,12128,4977,2581,2303,15173,380,24.26,58,45.102651,39.044660,12\n2026-04-20 08:50:00,7190,6685,3828,9187,12014,12151,5232,2574,2260,15132,335,24.39,57,45.102298,39.046996,10\n2026-04-20 08:50:15,7613,6778,4035,9326,12017,12390,5148,2573,2285,15148,344,24.32,57,45.101855,39.047854,11\n2026-04-20 08:50:30,7377,6680,3900,9089,12338,12169,4906,2522,2339,15190,384,24.24,60,45.101948,39.049181,12\n2026-04-20 08:50:45,7329,6704,3989,9064,12050,12376,5105,2400,2292,15220,390,24.58,57,45.101293,39.052253,10\n2026-04-20 08:51:00,7566,6974,4006,9098,12062,12319,5039,2440,2291,15251,383,24.54,58,45.101347,39.052150,11\n2026-04-20 08:51:15,7088,7056,3866,9380,12247,11976,5079,2471,2379,15255,363,24.39,60,45.100164,39.055203,13\n2026-04-20 08:51:30,7489,6962,3702,9420,12256,12301,5231,2536,2325,15130,380,24.31,57,45.100347,39.055666,11\n2026-04-20 08:51:45,7284,6966,3812,8939,11944,11971,5226,2448,2373,15187,329,24.34,60,45.100449,39.057678,11\n2026-04-20 08:52:00,7212,6935,3929,9295,11818,12127,5223,2386,2336,15239,341,24.24,58,45.099859,39.059484,12\n2026-04-20 08:52:15,7378,7292,3842,8885,11795,12144,5089,2370,2369,15250,376,24.45,60,45.099716,39.060123,10\n2026-04-20 08:52:30,7290,7317,3752,9314,11943,12080,5079,2370,2384,15200,386,24.63,57,45.099651,39.061676,10\n2026-04-20 08:52:45,7411,7165,3851,9097,12201,11920,5237,2354,2336,15235,383,24.29,59,45.098628,39.064069,12\n2026-04-20 08:53:00,7378,7264,3758,9387,12305,11707,4953,2463,2354,15253,335,24.59,58,45.098815,39.063933,12\n2026-04-20 08:53:15,7477,7275,3951,9265,12149,11774,5240,2356,2397,15234,315,24.35,57,45.097548,39.066231,10\n2026-04-20 08:53:30,7013,7343,3966,9290,12379,11728,4901,2432,2387,15225,356,24.46,60,45.097275,39.068890,11\n2026-04-20 08:53:45,7009,7344,3658,8874,11824,11547,5019,2307,2362,15267,342,24.61,57,45.098048,39.068746,13\n2026-04-20 08:54:00,7012,7631,3796,9111,11701,11690,5224,2448,2409,15140,301,24.46,57,45.097052,39.070063,11\n2026-04-20 08:54:15,7016,7680,3754,8844,12226,11875,5170,2365,2335,15132,365,24.64,60,45.097113,39.070750,11\n2026-04-20 08:54:30,7056,7765,3919,9106,11885,12037,5231,2429,2402,15160,359,24.43,59,45.095627,39.071597,12\n2026-04-20 08:54:45,7239,7638,3877,9005,11813,11985,5092,2312,2449,15230,355,24.63,58,45.094760,39.071910,12\n2026-04-20 08:55:00,7506,7866,3783,8980,11752,11944,4963,2455,2493,15254,307,24.76,57,45.093689,39.073868,11\n2026-04-20 08:55:15,7438,7830,3966,9320,11996,11801,5177,2431,2426,15151,318,24.65,59,45.093801,39.072859,10\n2026-04-20 08:55:30,7238,8019,4066,9332,12481,11913,5039,2349,2547,15210,350,24.55,56,45.092240,39.073617,12\n2026-04-20 08:55:45,7396,7786,4027,9259,11834,11751,5155,2467,2494,15193,314,24.67,59,45.091650,39.074513,10\n2026-04-20 08:56:00,7309,8114,3877,9101,12194,12180,5161,2436,2498,15182,333,24.66,59,45.090318,39.074754,10\n2026-04-20 08:56:15,7192,8007,3946,9271,12315,12189,5031,2395,2559,15265,318,24.84,58,45.089278,39.075202,12\n2026-04-20 08:56:30,7403,8057,3929,9335,12184,12095,5215,2387,2608,15190,316,24.54,57,45.088432,39.076676,13\n2026-04-20 08:56:45,7312,8165,4124,9378,12381,11786,5034,2482,2646,15225,344,24.86,56,45.088485,39.075844,12\n2026-04-20 08:57:00,7506,8198,4142,9272,11985,12128,5214,2426,2639,15187,314,24.60,56,45.086692,39.076528,13\n2026-04-20 08:57:15,7712,8281,4048,9338,12546,11821,5167,2484,2676,15242,330,24.48,56,45.086665,39.076872,13\n2026-04-20 08:57:30,7570,8239,3906,9568,12533,12028,5352,2441,2666,15262,283,24.50,57,45.085814,39.078119,11\n2026-04-20 08:57:45,7376,8412,3887,9450,12094,11924,5397,2372,2610,11392,298,24.89,59,45.084895,39.079073,13\n2026-04-20 08:58:00,7511,8382,3866,9277,12037,11707,5219,2369,2633,11447,325,24.75,56,45.084914,39.079560,13\n2026-04-20 08:58:15,7725,8468,4245,9547,12164,12163,5437,2504,2642,15201,326,24.60,56,45.082915,39.079847,10\n2026-04-20 08:58:30,7527,8352,4159,9224,12189,11884,5430,2527,2765,15171,318,24.92,58,45.081830,39.079380,12\n2026-04-20 08:58:45,7817,8354,4021,9441,12226,11837,5163,2405,2683,15245,324,24.65,56,45.082550,39.079917,11\n2026-04-20 08:59:00,7565,8189,4139,9269,12157,12067,5176,2456,2750,15167,297,24.62,56,45.080527,39.081825,12\n2026-04-20 08:59:15,7850,8423,4196,9795,12521,11825,5479,2389,2728,11405,279,24.76,56,45.080541,39.081431,11\n2026-04-20 08:59:30,7781,8318,4213,9315,12391,12229,5422,2438,2782,11341,276,24.67,60,45.079353,39.082529,10\n2026-04-20 08:59:45,7622,8509,4029,9760,12400,12013,5401,2378,2743,11398,284,24.90,57,45.079713,39.081942,13\n2026-04-20 09:00:00,7672,8198,4168,9500,12282,12027,5357,2381,2801,15139,323,24.57,56,45.078317,39.083434,13\n2026-04-20 09:00:15,7871,8416,4163,9689,12630,12281,5519,2532,2799,11437,301,24.77,55,45.077298,39.082645,13\n2026-04-20 09:00:30,7474,8368,4163,9716,12824,12054,5319,2443,2803,11335,334,24.65,57,45.076706,39.082619,12\n2026-04-20 09:00:45,7702,8132,4323,9595,12652,11914,5475,2521,2766,15176,289,24.88,58,45.076565,39.083658,12\n2026-04-20 09:01:00,7644,8385,4314,9896,12223,11823,5194,2443,2771,15270,266,24.64,58,45.075418,39.085038,12\n2026-04-20 09:01:15,7575,8420,4314,9765,12814,11894,5559,2449,2786,15261,282,24.56,56,45.074844,39.083787,13\n2026-04-20 09:01:30,7906,8074,4249,9616,12360,12195,5540,2436,2868,11371,312,24.94,58,45.074198,39.084627,10\n2026-04-20 09:01:45,7563,8345,4271,9973,12437,11802,5372,2522,2790,11365,267,24.77,56,45.073260,39.085403,13\n2026-04-20 09:02:00,7761,8029,4216,9566,12893,11826,5476,2493,2827,15264,308,24.81,55,45.072413,39.085862,12\n2026-04-20 09:02:15,7968,8186,4137,9582,12312,11797,5311,2433,2821,15219,265,24.63,59,45.071933,39.086330,11\n2026-04-20 09:02:30,7570,8013,4173,9959,12296,11889,5310,2523,2832,11395,266,24.56,56,45.072570,39.085466,11\n2026-04-20 09:02:45,7719,7992,4158,9745,12390,11821,5312,2394,2806,11428,281,24.72,56,45.070549,39.087231,12\n2026-04-20 09:03:00,7899,8003,4175,9406,12447,12156,5297,2496,2892,11368,268,24.68,56,45.071431,39.087143,13\n2026-04-20 09:03:15,7951,7761,4122,9784,12809,11902,5502,2456,2882,11460,266,24.74,55,45.070015,39.087749,11\n2026-04-20 09:03:30,7985,7990,4199,9546,12252,11627,5319,2491,2832,11473,305,24.81,59,45.069914,39.088284,12\n2026-04-20 09:03:45,7920,8025,4249,10078,12511,12011,5503,2411,2892,11423,267,24.73,56,45.068061,39.087395,12\n2026-04-20 09:04:00,7777,7923,4421,10033,12777,11741,5634,2534,2902,11421,243,24.79,56,45.067779,39.087518,12\n2026-04-20 09:04:15,7711,7815,4221,10069,12803,12008,5400,2472,2876,11354,307,24.78,58,45.068285,39.088462,11\n2026-04-20 09:04:30,7662,7820,4438,9631,12874,12116,5426,2439,2818,11380,289,24.67,57,45.066892,39.089503,10\n2026-04-20 09:04:45,8000,7565,4368,9640,12719,12073,5462,2422,2901,11392,273,25.00,55,45.066783,39.089101,12\n2026-04-20 09:05:00,7772,7749,4495,9611,12739,11774,5417,2390,2870,11467,288,24.94,59,45.064657,39.089570,12\n2026-04-20 09:05:15,7868,7352,4434,9602,12348,11774,5484,2460,2937,11343,295,24.81,57,45.064581,39.089764,10\n2026-04-20 09:05:30,7788,7440,4487,10143,12904,11728,5397,2466,2895,11406,278,24.70,55,45.063868,39.090475,12\n2026-04-20 09:05:45,7873,7482,4473,10127,12482,11985,5636,2428,2859,11440,258,24.62,57,45.062625,39.090588,11\n2026-04-20 09:06:00,8148,7271,4228,9839,12436,11812,5435,2452,2883,11429,276,24.72,58,45.063356,39.090660,12\n2026-04-20 09:06:15,7896,7326,4405,9735,12646,12125,5457,2466,2879,11420,258,24.74,55,45.062114,39.090447,13\n2026-04-20 09:06:30,8053,7323,4283,10145,13021,12052,5369,2475,2903,11370,287,24.62,56,45.061409,39.091487,10\n2026-04-20 09:06:45,7845,7069,4516,9975,12920,11640,5667,2491,2890,11399,267,24.96,57,45.060578,39.091166,13\n2026-04-20 09:07:00,8096,7260,4404,10145,12901,11891,5642,2453,2811,11337,267,24.99,55,45.060128,39.092595,12\n2026-04-20 09:07:15,7791,6963,4329,9830,12940,11768,5435,2476,2834,11450,284,24.81,59,45.059077,39.093620,12\n2026-04-20 09:07:30,8246,7020,4479,9762,12835,11958,5485,2479,2856,11444,262,24.67,58,45.057607,39.093092,10\n2026-04-20 09:07:45,7843,6851,4564,9979,12680,11641,5542,2429,2880,11327,259,24.96,54,45.056998,39.094020,10\n2026-04-20 09:08:00,8220,6853,4365,10076,12549,11485,5652,2386,2908,11368,237,24.87,58,45.056260,39.093658,12\n2026-04-20 09:08:15,8130,6888,4604,9688,12848,11901,5755,2437,2796,11373,241,24.92,56,45.055570,39.094935,12\n2026-04-20 09:08:30,8238,6884,4536,9805,12803,11750,5687,2325,2871,11331,242,24.55,55,45.055335,39.095166,13\n2026-04-20 09:08:45,8140,6778,4586,9983,13005,11775,5791,2487,2882,11334,272,24.62,57,45.053946,39.094255,13\n2026-04-20 09:09:00,7977,7001,4341,10292,13000,11378,5589,2439,2788,11448,212,24.67,57,45.053483,39.095651,12\n2026-04-20 09:09:15,7903,6641,4542,9776,12793,11669,5599,2309,2856,11333,247,24.75,58,45.051593,39.096374,13\n2026-04-20 09:09:30,8130,6804,4577,9874,12620,11463,5757,2419,2827,11414,218,24.88,57,45.051550,39.095607,10\n2026-04-20 09:09:45,8110,6813,4570,10261,12747,11409,5593,2453,2788,11353,265,24.62,55,45.049859,39.096347,12\n2026-04-20 09:10:00,7841,6636,4612,10044,12819,11738,5601,2399,2837,11458,250,24.65,55,45.049479,39.097134,11\n2026-04-20 09:10:15,8104,6798,4672,10218,12645,11253,5600,2424,2744,11458,204,24.77,57,45.049242,39.097602,13\n2026-04-20 09:10:30,8163,6668,4430,10100,12569,11228,5491,2372,2726,11349,253,24.77,58,45.048015,39.098279,11\n2026-04-20 09:10:45,8212,6481,4480,9872,12794,11295,5569,2315,2788,11438,242,24.65,55,45.047526,39.097640,12\n2026-04-20 09:11:00,7750,6727,4357,10264,12759,11658,5637,2349,2753,11455,190,24.53,57,45.046602,39.099754,11\n2026-04-20 09:11:15,8250,6425,4639,10306,12938,11276,5841,2268,2791,11409,229,24.83,57,45.044333,39.099445,12\n2026-04-20 09:11:30,7963,6447,4537,10189,12568,11356,5826,2371,2694,11381,191,24.74,58,45.044089,39.099480,12\n2026-04-20 09:11:45,8206,6331,4714,10067,13055,11477,5841,2266,2749,11399,247,24.47,58,45.043310,39.099324,13\n2026-04-20 09:12:00,8185,6558,4548,10078,12870,11294,5638,2275,2765,11447,214,24.46,56,45.042680,39.100465,12\n2026-04-20 09:12:15,7850,6515,4735,10185,12923,11271,5589,2386,2701,11371,227,24.69,58,45.041997,39.099018,12\n2026-04-20 09:12:30,7908,6364,4619,10147,12656,11602,5706,2332,2786,7612,239,24.82,54,45.041221,39.098692,11\n2026-04-20 09:12:45,8036,6583,4626,9956,12818,11579,5611,2289,2670,11423,225,24.41,55,45.040446,39.099442,11\n2026-04-20 09:13:00,7917,6401,4646,9978,13285,11519,5902,2314,2695,11332,216,24.61,55,45.040108,39.098320,13\n2026-04-20 09:13:15,8436,6358,4719,10484,12966,11134,5865,2325,2794,11326,206,24.40,57,45.038606,39.097535,10\n2026-04-20 09:13:30,8133,6339,4751,10102,12758,11150,5679,2289,2788,7630,196,24.75,57,45.038930,39.097096,10\n2026-04-20 09:13:45,8156,6259,4711,10198,13246,11371,5869,2435,2791,11424,186,24.72,56,45.037947,39.096755,10\n2026-04-20 09:14:00,8126,6473,4746,10463,12880,11626,5872,2386,2716,7644,200,24.40,58,45.036267,39.096090,12\n2026-04-20 09:14:15,8188,6355,4966,10576,13120,11451,5861,2434,2791,11462,196,24.55,56,45.035631,39.094224,10\n2026-04-20 09:14:30,8201,6530,4985,10430,13347,11479,6001,2402,2815,7549,165,24.45,57,45.034577,39.094586,10\n2026-04-20 09:14:45,8440,6383,4899,10400,13152,11698,5897,2454,2793,11381,166,24.40,59,45.034546,39.093971,11\n2026-04-20 09:15:00,8440,6403,4912,10376,13002,11572,6066,2364,2760,11457,188,24.37,57,45.033296,39.092807,11\n2026-04-20 09:15:15,8323,6582,5016,10499,13004,11820,5992,2487,2845,11466,181,24.38,58,45.033733,39.091423,11\n2026-04-20 09:15:30,8255,6368,5035,10738,13285,11349,5951,2382,2830,7653,206,24.67,56,45.033145,39.091321,12\n2026-04-20 09:15:45,8491,6447,4962,10549,13389,11802,5860,2397,2841,7665,166,24.56,57,45.031401,39.091202,13\n2026-04-20 09:16:00,8563,6627,4990,10809,13593,11718,5906,2451,2798,11402,228,24.64,58,45.030743,39.089945,11\n2026-04-20 09:16:15,8815,6478,5184,10815,13189,11711,6159,2385,2845,7599,204,24.38,57,45.030525,39.088294,13\n2026-04-20 09:16:30,8557,6552,4922,10832,13161,11638,5865,2417,2903,7559,171,24.46,57,45.030629,39.087469,11\n2026-04-20 09:16:45,8649,6663,5238,10519,13260,11540,6193,2461,2843,7540,155,24.70,55,45.029206,39.087163,12\n2026-04-20 09:17:00,8819,6441,5236,10583,13216,11628,5909,2540,2875,7543,183,24.54,57,45.028378,39.085977,11\n2026-04-20 09:17:15,8715,6663,5150,10785,13220,11793,6016,2417,2895,7659,208,24.41,57,45.027607,39.085966,12\n2026-04-20 09:17:30,8847,6674,5160,10908,13520,11557,5925,2459,2893,7580,182,24.48,56,45.027155,39.084773,10\n2026-04-20 09:17:45,8618,6352,5274,10620,13644,11978,6263,2466,2903,7557,162,24.27,56,45.026262,39.084134,11\n2026-04-20 09:18:00,8822,6462,5164,10643,13853,11537,5990,2432,2841,11357,212,24.24,55,45.025833,39.084001,11\n2026-04-20 09:18:15,8908,6470,5087,10681,13433,11927,5973,2502,2879,7577,151,24.60,55,45.025423,39.083680,12\n2026-04-20 09:18:30,8790,6640,5221,10775,13714,11758,6227,2465,2915,7552,177,24.55,54,45.023793,39.082006,11\n2026-04-20 09:18:45,9031,6421,5214,10720,13959,12050,6210,2491,2874,7626,164,24.36,55,45.024040,39.082001,11\n2026-04-20 09:19:00,9096,6479,5247,11037,13867,11993,6208,2400,2878,7578,163,24.47,54,45.022339,39.081735,11\n2026-04-20 09:19:15,8814,6605,5342,10892,13619,12056,6381,2508,2885,7594,186,24.45,55,45.022293,39.079364,13\n2026-04-20 09:19:30,8710,6442,5365,10823,13454,11929,6223,2432,2875,7618,173,24.40,58,45.021120,39.079659,12\n2026-04-20 09:19:45,9035,6438,5507,11096,13817,11589,6317,2416,2969,7532,180,24.52,58,45.020524,39.078651,13\n2026-04-20 09:20:00,9066,6558,5310,11192,13931,11621,6371,2502,2885,7555,142,24.22,57,45.019836,39.078425,11\n2026-04-20 09:20:15,8970,6497,5318,11380,14139,11541,6331,2501,2950,7577,147,24.12,59,45.017665,39.076575,13\n2026-04-20 09:20:30,9213,6480,5579,11212,14113,11612,6397,2461,2948,7526,147,24.28,57,45.017864,39.076586,12\n2026-04-20 09:20:45,9263,6533,5415,11152,13526,11965,6307,2412,2938,7622,121,24.36,56,45.017606,39.076733,13\n2026-04-20 09:21:00,9060,6448,5454,11394,13621,11663,6454,2482,2973,7605,168,24.43,57,45.016346,39.075627,11\n2026-04-20 09:21:15,9070,6571,5406,11289,13984,11986,6156,2479,2897,7570,170,24.12,56,45.014616,39.074752,10\n2026-04-20 09:21:30,9150,6706,5566,11098,13697,11988,6477,2537,2985,7580,183,24.07,56,45.014571,39.073974,11\n2026-04-20 09:21:45,9067,6518,5608,11313,13686,11772,6205,2468,2917,7638,121,24.05,58,45.012979,39.073732,11\n2026-04-20 09:22:00,9138,6670,5707,11182,13955,11765,6302,2425,2925,7594,134,24.06,57,45.012549,39.071881,11\n2026-04-20 09:22:15,8917,6370,5584,11109,13916,11984,6209,2466,2967,7674,130,24.03,58,45.011807,39.071600,11\n2026-04-20 09:22:30,9245,6646,5630,11541,14225,11728,6284,2457,2963,7656,177,24.35,55,45.010802,39.071276,12\n2026-04-20 09:22:45,9277,6400,5469,11162,13986,11530,6199,2434,2888,7578,156,24.22,55,45.010995,39.071859,10\n2026-04-20 09:23:00,9079,6413,5565,11223,14183,11561,6490,2448,2874,7608,126,24.22,55,45.008619,39.070465,13\n2026-04-20 09:23:15,9199,6498,5639,11648,13681,11420,6367,2498,2857,7564,116,23.89,55,45.007822,39.069913,11\n2026-04-20 09:23:30,9392,6409,5558,11265,13682,11668,6358,2435,2919,7573,128,23.84,56,45.007350,39.069463,13\n2026-04-20 09:23:45,8998,6448,5788,11258,13808,11723,6197,2395,2931,7592,169,23.83,57,45.006555,39.069329,11\n2026-04-20 09:24:00,9341,6568,5808,11488,14327,11721,6235,2472,2934,7553,116,23.90,57,45.006082,39.067591,12\n2026-04-20 09:24:15,9247,6475,5749,11391,13913,11326,6361,2392,2937,7597,144,23.95,58,45.004794,39.067724,13\n2026-04-20 09:24:30,8922,6371,5686,11391,13798,11272,6481,2408,2905,7628,160,24.02,56,45.005271,39.068167,10\n2026-04-20 09:24:45,9009,6531,5777,11569,13745,11457,6398,2416,2901,7666,129,24.11,58,45.004365,39.067621,12\n2026-04-20 09:25:00,8953,6394,5592,11647,14207,11256,6476,2446,2908,7647,114,23.70,58,45.003211,39.067128,13\n2026-04-20 09:25:15,9037,6240,5524,11508,13756,11655,6208,2452,2849,7588,156,23.92,57,45.003105,39.066341,11\n2026-04-20 09:25:30,9448,6413,5725,11359,13916,11567,6573,2476,2879,7633,130,23.97,57,45.001749,39.064389,10\n2026-04-20 09:25:45,9234,6487,5861,11423,14427,11373,6273,2385,2890,7539,87,23.82,55,45.001395,39.063969,12\n2026-04-20 09:26:00,9091,6378,5659,11336,13797,11203,6303,2394,2863,7580,146,23.78,59,45.000373,39.064252,11\n2026-04-20 09:26:15,9070,6393,5637,11849,14402,11310,6284,2329,2875,7641,100,23.59,59,45.000309,39.063618,11\n2026-04-20 09:26:30,8990,6308,5740,11573,13997,11113,6358,2359,2864,7622,144,23.77,59,44.999187,39.062361,11\n2026-04-20 09:26:45,9100,6422,5766,11414,14112,11324,6354,2293,2864,7599,153,23.70,59,44.998153,39.063662,10\n2026-04-20 09:27:00,9300,6446,5670,11850,14114,11086,6289,2386,2837,7639,100,23.72,57,44.998924,39.061370,13\n2026-04-20 09:27:15,9363,6371,5853,11401,13801,11142,6281,2402,2871,3745,93,23.50,57,44.997536,39.061285,13\n2026-04-20 09:27:30,9053,6195,5809,11544,14117,10886,6277,2405,2803,7656,118,23.75,57,44.996366,39.061939,11\n2026-04-20 09:27:45,9168,6481,5638,11655,14061,11181,6288,2413,2846,3818,148,23.60,59,44.996123,39.060306,12\n2026-04-20 09:28:00,9216,6328,5834,11737,14054,11120,6325,2334,2866,3774,133,23.57,57,44.995299,39.060656,10\n2026-04-20 09:28:15,9048,6471,5815,11517,14105,11051,6562,2285,2890,3821,119,23.41,57,44.995348,39.059418,11\n2026-04-20 09:28:30,9296,6382,5749,11700,13953,11026,6424,2330,2867,7648,133,23.57,58,44.994482,39.060074,12\n2026-04-20 09:28:45,9035,6408,5901,11346,13967,10805,6569,2339,2869,3728,110,23.36,60,44.994502,39.058919,12\n2026-04-20 09:29:00,8862,6270,5678,11492,14051,10909,6448,2281,2835,3797,128,23.40,58,44.993249,39.058135,11\n2026-04-20 09:29:15,9316,6382,5733,11726,14065,11173,6274,2346,2824,7542,76,23.45,59,44.992171,39.057283,11\n2026-04-20 09:29:30,9147,6149,5783,11496,14227,10753,6295,2383,2805,3836,124,23.29,59,44.991807,39.057679,12\n2026-04-20 09:29:45,9274,6088,5826,11252,14218,10996,6427,2314,2777,3864,87,23.56,57,44.991143,39.057394,11\n2026-04-20 09:30:00,9280,6240,5842,11310,13992,11139,6288,2363,2844,3769,96,23.48,56,44.991633,39.056444,13\n2026-04-20 09:30:15,9272,6268,5665,11810,14107,11061,6389,2316,2823,3839,106,23.56,57,44.990370,39.054174,11\n2026-04-20 09:30:30,9363,6287,5743,11667,14133,11149,6275,2372,2795,7628,82,23.36,56,44.990212,39.053588,11\n2026-04-20 09:30:45,9079,6412,5734,11921,13974,10900,6240,2336,2781,3811,86,23.45,56,44.989729,39.052053,11\n2026-04-20 09:31:00,8973,6271,5764,11718,13863,11028,6494,2279,2770,3762,90,23.38,56,44.988947,39.051391,11\n2026-04-20 09:31:15,8980,6286,5937,11725,13925,11128,6509,2240,2791,7598,87,23.32,56,44.988145,39.050192,12\n2026-04-20 09:31:30,9269,6120,5951,11801,13917,10614,6521,2362,2848,3795,87,23.12,60,44.987766,39.049234,10\n2026-04-20 09:31:45,9217,6241,5980,11774,14067,10628,6438,2355,2848,3871,114,23.38,56,44.988349,39.049352,12\n2026-04-20 09:32:00,8969,6035,5922,11716,14467,10958,6428,2295,2826,3871,72,23.19,60,44.986575,39.048280,11\n2026-04-20 09:32:15,9377,6330,6025,12034,14556,10900,6372,2264,2806,7635,108,23.25,60,44.986876,39.046593,12\n2026-04-20 09:32:30,9096,6059,5887,11986,14065,10991,6485,2331,2824,3832,82,23.04,56,44.985445,39.045745,12\n2026-04-20 09:32:45,9216,6201,6049,11754,14186,10670,6562,2297,2755,3770,73,23.31,58,44.985796,39.043633,12\n2026-04-20 09:33:00,8903,6175,6056,11856,14282,10720,6483,2323,2768,3738,93,23.09,57,44.984581,39.042399,12\n2026-04-20 09:33:15,8998,6367,5973,11622,14418,10687,6536,2217,2731,3855,79,22.92,57,44.984123,39.042418,13\n2026-04-20 09:33:30,8964,6312,5948,12078,14468,10783,6357,2238,2829,3872,82,22.86,59,44.984121,39.040628,12\n2026-04-20 09:33:45,9285,6229,5802,11717,14151,10579,6263,2233,2769,3851,96,23.09,59,44.982728,39.040030,11\n2026-04-20 09:34:00,9111,6031,6082,11632,14625,10886,6282,2234,2785,7539,76,22.80,58,44.982557,39.039715,13\n2026-04-20 09:34:15,8869,6218,5796,11784,14596,10424,6497,2196,2697,3751,81,22.74,59,44.981281,39.037506,13\n2026-04-20 09:34:30,9219,6189,6029,12005,14080,10361,6457,2205,2756,3864,88,22.96,60,44.981168,39.037346,10\n2026-04-20 09:34:45,8990,6286,5886,11814,14053,10658,6571,2257,2696,3797,79,22.77,61,44.980564,39.035332,10\n2026-04-20 09:35:00,9231,6167,5991,11567,14259,10756,6540,2299,2704,3775,91,23.02,57,44.979341,39.035343,12\n2026-04-20 09:35:15,9063,5972,6073,11587,14606,10372,6333,2189,2689,3783,72,22.60,57,44.979310,39.033073,13\n2026-04-20 09:35:30,8919,6139,6062,11876,14647,10695,6365,2245,2738,3806,76,22.60,59,44.978834,39.032729,12\n2026-04-20 09:35:45,9025,6119,5884,12080,13957,10705,6467,2206,2644,3842,71,22.50,59,44.978101,39.031818,13\n2026-04-20 09:36:00,8917,5976,5923,11663,14619,10233,6233,2209,2677,3874,88,22.77,57,44.977738,39.030048,11\n2026-04-20 09:36:15,8939,5970,6041,11822,14436,10676,6346,2242,2620,3841,79,22.76,58,44.977037,39.029052,11\n2026-04-20 09:36:30,8857,5889,5967,11514,14300,10473,6226,2218,2656,3793,82,22.65,61,44.976308,39.028981,11\n2026-04-20 09:36:45,9106,6014,5815,11913,14342,10117,6495,2192,2684,3816,82,22.46,60,44.975589,39.028657,13\n2026-04-20 09:37:00,8961,6155,5780,11909,13981,10128,6409,2161,2631,3755,86,22.58,61,44.974591,39.027204,12\n2026-04-20 09:37:15,8968,5995,5930,11863,14430,10307,6172,2202,2556,3846,75,22.61,59,44.973649,39.025870,12\n2026-04-20 09:37:30,8966,5976,5762,11455,14201,10047,6299,2236,2616,3768,89,22.50,60,44.973368,39.026131,12\n2026-04-20 09:37:45,8888,6052,5908,12022,14534,10472,6463,2149,2606,3771,88,22.35,60,44.973183,39.023513,12\n2026-04-20 09:38:00,8557,6054,5728,11932,14051,10057,6207,2225,2590,3748,76,22.31,61,44.972273,39.023623,11\n2026-04-20 09:38:15,8969,5800,5824,11559,14492,10351,6222,2161,2531,3779,84,22.49,58,44.972111,39.023000,11\n2026-04-20 09:38:30,8695,5900,5644,11502,13896,9982,6273,2089,2571,3738,72,22.11,60,44.970860,39.021814,12\n2026-04-20 09:38:45,8768,5955,5726,11505,14432,10062,6145,2190,2561,3794,82,22.27,60,44.970318,39.020514,12\n2026-04-20 09:39:00,8634,5768,5771,11864,14320,10343,6084,2103,2479,3775,79,22.27,60,44.970604,39.019237,12\n2026-04-20 09:39:15,8635,5823,5728,11815,13942,10068,6374,2174,2466,3805,82,22.03,60,44.970401,39.018107,13\n2026-04-20 09:39:30,8927,5840,5819,11793,14394,10033,6258,2126,2473,3847,76,22.37,59,44.969638,39.018370,12\n2026-04-20 09:39:45,8529,5693,5704,11727,13920,9906,6343,2045,2527,3757,77,22.29,58,44.969291,39.017702,12\n2026-04-20 09:40:00,8819,5744,5900,11358,14298,9796,6281,2047,2475,3842,82,21.94,61,44.968726,39.016821,11\n2026-04-20 09:40:15,8679,5624,5568,11644,13873,9735,6194,2074,2414,3868,73,22.05,59,44.966788,39.014484,13\n2026-04-20 09:40:30,8364,5833,5703,11328,13870,9831,6239,2022,2417,3856,75,21.92,61,44.966343,39.014230,12\n2026-04-20 09:40:45,8524,5848,5776,11815,13936,10083,5969,2083,2472,0,75,22.02,59,44.966663,39.012371,11\n2026-04-20 09:41:00,8702,5647,5584,11438,13952,9635,5930,2109,2373,3784,88,21.99,62,44.965439,39.011758,12\n2026-04-20 09:41:15,8520,5853,5683,11745,14166,9524,6140,2032,2398,3831,87,22.08,61,44.966040,39.011811,12\n2026-04-20 09:41:30,8560,5735,5579,11657,13908,9823,6204,2070,2298,3837,77,21.65,59,44.964046,39.010305,12\n2026-04-20 09:41:45,8291,5535,5755,11401,14235,9881,5963,2006,2357,3829,81,21.59,63,44.963620,39.008927,12\n2026-04-20 09:42:00,8183,5822,5683,11607,14142,9582,6064,2075,2368,3779,85,21.80,62,44.962937,39.008335,11\n2026-04-20 09:42:15,8636,5741,5741,11621,13878,9418,5965,1997,2291,3848,75,21.86,62,44.963615,39.007116,12\n2026-04-20 09:42:30,8202,5716,5686,11492,13909,9405,6015,2003,2318,3821,87,21.89,63,44.963332,39.006417,11\n2026-04-20 09:42:45,8069,5541,5438,11119,14093,9745,6126,2084,2322,3751,88,21.74,61,44.962512,39.006227,12\n2026-04-20 09:43:00,8200,5657,5508,11441,13710,9236,5883,1910,2204,14,79,21.50,62,44.960807,39.004947,13\n2026-04-20 09:43:15,8384,5692,5583,11015,13761,9668,5968,1889,2263,3765,77,21.55,63,44.960281,39.004010,12\n2026-04-20 09:43:30,8275,5543,5466,11516,13645,9434,6115,1934,2281,0,78,21.70,62,44.960036,39.003127,13\n2026-04-20 09:43:45,8223,5382,5319,11298,13757,9272,5825,2003,2167,0,75,21.65,59,44.959393,39.000879,12\n2026-04-20 09:44:00,8283,5423,5358,10855,13919,9284,5979,1883,2219,3760,73,21.27,61,44.958330,39.000068,11\n2026-04-20 09:44:15,7937,5549,5505,11123,13721,9362,6022,1977,2151,3811,85,21.55,61,44.957991,38.999490,13\n2026-04-20 09:44:30,7927,5382,5325,11060,13465,9494,5744,1916,2165,3813,72,21.49,61,44.957844,38.997443,12\n2026-04-20 09:44:45,7778,5530,5461,10880,13427,8997,5844,1886,2156,3802,85,21.42,63,44.957159,38.996896,13\n2026-04-20 09:45:00,7978,5281,5351,10825,13403,9421,5763,1853,2122,3765,74,21.30,60,44.956884,38.995933,13\n2026-04-20 09:45:15,7851,5568,5263,11205,13300,9113,5735,1914,2130,73,88,21.43,62,44.955026,38.994370,13\n2026-04-20 09:45:30,7722,5533,5092,10969,13810,9214,5694,1867,2098,33,89,21.38,60,44.954759,38.993520,13\n2026-04-20 09:45:45,7739,5518,5438,11039,13778,8924,5654,1804,2039,3764,85,21.29,64,44.955004,38.992910,11\n2026-04-20 09:46:00,7972,5500,5175,10988,13449,9237,5608,1784,2010,3746,86,21.12,60,44.954240,38.992265,11\n2026-04-20 09:46:15,7823,5438,5066,11110,13602,9231,5851,1807,2034,0,72,21.12,60,44.953543,38.990871,13\n2026-04-20 09:46:30,7735,5369,5228,10831,13645,8785,5575,1757,2015,3850,75,20.86,63,44.952606,38.989963,12\n2026-04-20 09:46:45,7794,5196,4965,10544,13447,8704,5529,1832,1998,24,73,20.92,63,44.951908,38.987256,11\n2026-04-20 09:47:00,7353,5236,5030,10677,13586,8629,5684,1750,1946,0,88,20.92,62,44.950429,38.987301,12\n2026-04-20 09:47:15,7385,5158,5026,10810,13183,8939,5601,1711,1939,3811,72,20.77,62,44.949985,38.985042,13\n2026-04-20 09:47:30,7281,5063,4775,10492,13519,8470,5493,1821,1932,0,79,20.66,62,44.948601,38.984033,11\n2026-04-20 09:47:45,7521,5048,4892,10680,13334,8555,5508,1767,1859,0,78,20.60,64,44.947758,38.983655,11\n2026-04-20 09:48:00,7455,5119,4808,10491,13350,8460,5627,1754,1883,3842,76,20.96,61,44.947641,38.982151,11\n2026-04-20 09:48:15,7342,4962,4841,10237,13418,8717,5588,1809,1816,0,82,20.71,61,44.947640,38.980405,12\n2026-04-20 09:48:30,7723,5056,4942,10533,13194,8723,5507,1827,1818,71,83,20.77,63,44.949296,38.978499,11\n2026-04-20 09:48:45,7662,5307,4864,10374,13343,8966,5594,1730,1850,29,77,20.56,64,44.949045,38.977110,11\n2026-04-20 09:49:00,7441,5135,4863,10538,13520,8953,5514,1780,1885,0,75,20.75,64,44.948686,38.976536,11\n2026-04-20 09:49:15,7314,5226,5004,10928,13613,8618,5431,1824,1908,29,76,20.47,61,44.950192,38.974527,13\n2026-04-20 09:49:30,7686,4999,4970,10696,13101,8715,5704,1793,1847,51,86,20.60,62,44.949581,38.973693,11\n2026-04-20 09:49:45,7446,5165,5102,10360,13148,8590,5460,1736,1818,0,84,20.36,63,44.949924,38.971835,11\n2026-04-20 09:50:00,7590,4957,5059,10432,13054,8510,5561,1704,1855,0,75,20.63,61,44.950180,38.969957,13\n2026-04-20 09:50:15,7255,5158,5140,10787,13437,8535,5471,1819,1809,0,75,20.47,62,44.951524,38.967773,13\n2026-04-20 09:50:30,7489,5162,5204,10805,13402,8966,5647,1825,1872,24,86,20.48,61,44.952111,38.967753,12\n2026-04-20 09:50:45,7483,5141,5025,10528,13654,8567,5644,1739,1809,0,88,20.10,64,44.951951,38.964602,11\n2026-04-20 09:51:00,7467,5060,5036,10822,13532,8885,5547,1881,1798,0,80,20.22,65,44.952932,38.963582,11\n2026-04-20 09:51:15,7736,5163,4987,11011,13298,8797,5393,1842,1829,0,74,20.36,62,44.952674,38.961787,11\n2026-04-20 09:51:30,7724,5275,5212,10905,13464,8603,5655,1840,1857,68,84,20.26,63,44.953314,38.960588,13\n2026-04-20 09:51:45,7398,5103,5087,10625,13147,8639,5580,1853,1774,0,87,19.91,64,44.953788,38.959224,11\n2026-04-20 09:52:00,7420,5273,5144,11038,13710,8975,5433,1771,1820,0,73,20.06,62,44.954748,38.958766,11\n2026-04-20 09:52:15,7714,5230,5152,11127,13173,8896,5461,1828,1812,0,80,19.83,63,44.954184,38.957698,11\n2026-04-20 09:52:30,7376,5089,5352,10600,13771,8848,5540,1794,1804,0,82,19.90,62,44.955175,38.954894,11\n2026-04-20 09:52:45,7689,5251,5453,10822,13219,8635,5659,1852,1879,0,72,19.83,63,44.956385,38.954296,12\n2026-04-20 09:53:00,7807,5078,5326,10988,13439,8735,5554,1768,1867,2,86,20.05,63,44.956918,38.952080,11\n2026-04-20 09:53:15,7821,5127,5333,11210,13843,9087,5564,1798,1846,3,73,20.00,65,44.956978,38.952150,12\n2026-04-20 09:53:30,7681,5163,5408,10859,13354,8910,5523,1842,1779,0,74,19.88,66,44.957425,38.950530,13\n2026-04-20 09:53:45,7414,4992,5269,11039,13537,8779,5606,1811,1812,0,72,19.76,64,44.958168,38.948646,13\n2026-04-20 09:54:00,7371,5191,5341,10814,13676,8760,5436,1871,1802,15,78,19.87,63,44.957690,38.947276,11\n2026-04-20 09:54:15,7765,5166,5214,10948,13658,8871,5453,1853,1766,57,87,19.56,66,44.959244,38.945450,12\n2026-04-20 09:54:30,7368,5050,5436,10870,13621,9069,5596,1931,1789,60,80,19.68,65,44.959684,38.944301,12\n2026-04-20 09:54:45,7507,5111,5306,11017,13345,9063,5392,1791,1790,0,78,19.49,65,44.959363,38.943549,12\n2026-04-20 09:55:00,7468,5003,5278,11127,13890,8690,5617,1789,1839,0,85,19.68,63,44.960614,38.941929,11\n2026-04-20 09:55:15,7629,5129,5556,11079,13301,8892,5603,1838,1833,0,75,19.70,66,44.960814,38.940724,13\n2026-04-20 09:55:30,7512,5164,5549,11280,13352,8814,5601,1826,1847,0,73,19.56,65,44.962067,38.938985,12\n2026-04-20 09:55:45,7403,4947,5317,11229,13908,8670,5711,1938,1739,50,80,19.55,64,44.962321,38.937860,11\n2026-04-20 09:56:00,7888,5178,5368,11179,13614,8876,5479,1955,1815,0,71,19.22,64,44.963319,38.936765,13\n2026-04-20 09:56:15,7636,5020,5640,11420,13740,8940,5451,1859,1787,0,76,19.40,63,44.963540,38.935992,11\n2026-04-20 09:56:30,7884,5241,5391,11448,13434,8695,5748,1947,1789,0,76,19.48,67,44.964260,38.934718,11\n2026-04-20 09:56:45,7591,5104,5584,11034,13517,8853,5592,1842,1743,0,73,19.05,66,44.964571,38.933358,13\n2026-04-20 09:57:00,7804,5167,5319,10951,13773,8853,5689,1875,1741,0,73,19.05,67,44.964421,38.931190,13\n2026-04-20 09:57:15,7674,4918,5298,10982,13790,8889,5671,1936,1761,45,88,19.11,64,44.964401,38.930295,12\n2026-04-20 09:57:30,7818,5096,5405,11427,13584,8991,5384,1945,1772,0,85,19.27,66,44.966336,38.929628,12\n2026-04-20 09:57:45,7392,5147,5496,11287,13509,8768,5413,1869,1725,72,73,19.24,64,44.965912,38.927242,13\n2026-04-20 09:58:00,7838,5044,5521,11036,13917,8592,5515,1891,1698,29,79,18.83,64,44.967265,38.926140,13\n2026-04-20 09:58:15,7643,5021,5396,11272,13525,9085,5609,1819,1704,0,88,19.17,67,44.967559,38.924646,13\n2026-04-20 09:58:30,7788,5050,5641,11289,13487,8976,5674,1921,1728,0,87,18.85,67,44.968023,38.923941,13\n2026-04-20 09:58:45,7781,5117,5475,11390,13519,8814,5340,1894,1694,0,79,18.84,64,44.968221,38.922512,11\n2026-04-20 09:59:00,7799,5219,5549,11098,13629,9041,5394,1884,1687,0,83,19.03,66,44.968984,38.920810,11\n2026-04-20 09:59:15,7303,4959,5477,11027,13832,8677,5500,1939,1714,0,74,18.72,65,44.969451,38.919754,13\n2026-04-20 09:59:30,7468,4909,5544,11389,13461,9015,5344,1825,1697,37,85,18.91,65,44.969710,38.917971,12\n2026-04-20 09:59:45,7661,5110,5581,10903,13561,8670,5282,1914,1655,26611,80,18.88,67,44.969610,38.915900,12\n2026-04-20 17:15:00,7259,6107,3890,8765,11683,13030,4896,2690,2170,19054,374,20.17,61,45.107643,39.020590,11\n2026-04-20 17:15:15,7277,6162,3639,9106,12155,13088,5043,2573,2143,19035,409,19.97,63,45.108445,39.023098,10\n2026-04-20 17:15:30,7560,6423,3617,8999,12225,13133,4921,2696,2231,18976,415,20.10,64,45.106783,39.023370,12\n2026-04-20 17:15:45,7534,6176,3802,8878,12141,13269,4840,2745,2257,19059,418,20.16,62,45.106629,39.026029,11\n2026-04-20 17:16:00,7476,6284,3652,9058,12305,13350,5082,2698,2275,19074,429,20.09,60,45.106263,39.027354,13\n2026-04-20 17:16:15,7272,6247,3867,8960,12251,13191,4906,2705,2254,19002,399,20.15,60,45.106871,39.028390,12\n2026-04-20 17:16:30,7619,6387,3738,9304,11703,12897,5099,2606,2217,18976,428,20.21,61,45.106227,39.031061,11\n2026-04-20 17:16:45,7500,6159,3857,8915,11716,13250,5103,2700,2262,19024,438,20.39,61,45.105911,39.031807,12\n2026-04-20 17:17:00,7458,6339,3837,9358,12053,13180,5020,2769,2273,18947,385,20.52,59,45.104303,39.032669,12\n2026-04-20 17:17:15,7429,6415,3687,8929,12185,13281,5134,2660,2225,18974,392,20.44,59,45.105315,39.034236,13\n2026-04-20 17:17:30,7708,6392,3678,8828,12025,12973,5119,2756,2291,19007,442,20.38,59,45.104338,39.035409,11\n2026-04-20 17:17:45,7395,6289,3700,9074,12288,12868,5129,2672,2318,19057,406,20.28,60,45.103617,39.037865,11\n2026-04-20 17:18:00,7576,6456,3826,9244,11694,13159,4910,2740,2205,19011,428,20.70,60,45.104320,39.038701,11\n2026-04-20 17:18:15,7425,6160,3859,9158,12201,13109,5002,2684,2223,19011,392,20.46,60,45.102481,39.040748,11\n2026-04-20 17:18:30,7482,6192,3843,9297,11702,13369,4931,2648,2229,18936,411,20.84,59,45.102889,39.042311,11\n2026-04-20 17:18:45,7496,6431,3851,9211,12036,13278,4875,2712,2273,19051,385,20.66,59,45.103311,39.043493,11\n2026-04-20 17:19:00,7510,6223,3922,9174,11754,13262,5112,2735,2220,18964,426,20.87,60,45.101895,39.045180,13\n2026-04-20 17:19:15,7617,6313,3663,9250,11762,12731,5127,2593,2230,18958,386,20.56,62,45.102344,39.047181,10\n2026-04-20 17:19:30,7466,6175,3638,8868,12240,13028,5005,2725,2224,18991,427,20.78,58,45.100943,39.047982,12\n2026-04-20 17:19:45,7544,6127,3804,8922,12334,12802,5144,2626,2301,18931,386,20.93,62,45.100844,39.049851,11\n2026-04-20 17:20:00,7380,6395,3578,9298,11818,12914,5006,2610,2237,19034,401,20.88,61,45.101571,39.051616,11\n2026-04-20 17:20:15,7643,6304,3870,9060,11764,13175,4943,2645,2177,18965,424,20.84,59,45.101527,39.053219,13\n2026-04-20 17:20:30,7711,6202,3595,8801,12063,13029,5096,2653,2243,19021,419,20.86,59,45.099775,39.055875,12\n2026-04-20 17:20:45,7393,6245,3668,8805,12048,12945,4891,2689,2196,18950,419,21.00,61,45.100471,39.057239,12\n2026-04-20 17:21:00,7524,6258,3760,8835,11959,12868,5067,2589,2215,19068,399,21.12,60,45.100104,39.059163,10\n2026-04-20 17:21:15,7417,6323,3599,9136,12276,12960,5142,2689,2256,19025,412,21.17,60,45.098911,39.060868,11\n2026-04-20 17:21:30,7277,6058,3551,9149,11729,12824,5047,2626,2214,18973,360,21.14,57,45.099705,39.062522,11\n2026-04-20 17:21:45,7602,6034,3608,8911,11965,12969,5164,2560,2200,19009,405,21.29,57,45.099103,39.062976,10\n2026-04-20 17:22:00,7605,6335,3548,8809,11976,12527,4984,2533,2232,18971,424,21.19,61,45.099329,39.064446,12\n2026-04-20 17:22:15,7508,6079,3767,9257,11944,12580,5064,2533,2168,19059,386,21.11,59,45.097979,39.067359,11\n2026-04-20 17:22:30,7239,6025,3570,9265,12095,12427,5042,2629,2194,18931,423,21.43,58,45.097028,39.067988,11\n2026-04-20 17:22:45,7378,6275,3711,8945,11681,12577,4883,2491,2179,18969,376,21.22,59,45.097715,39.071398,12\n2026-04-20 17:23:00,7209,6150,3670,9204,12148,12628,4983,2510,2214,19011,403,21.20,59,45.097384,39.071193,13\n2026-04-20 17:23:15,7247,6121,3775,9152,11753,12893,5101,2574,2183,19075,432,21.33,56,45.096008,39.071735,13\n2026-04-20 17:23:30,7668,6175,3856,8903,11709,12596,5205,2651,2255,19010,422,21.41,56,45.094352,39.072864,13\n2026-04-20 17:23:45,7439,6357,3886,9084,12276,12771,4927,2586,2257,15247,371,21.38,59,45.093670,39.072859,13\n2026-04-20 17:24:00,7426,6293,3732,9293,11949,12505,5172,2662,2276,18931,424,21.54,59,45.093248,39.072998,11\n2026-04-20 17:24:15,7653,6383,3888,9192,11795,12857,5221,2572,2263,15174,394,21.42,57,45.091581,39.075061,12\n2026-04-20 17:24:30,7799,6241,3850,9237,12077,12936,5216,2680,2300,18956,397,21.56,59,45.091599,39.074067,13\n2026-04-20 17:24:45,7561,6211,3823,8886,12101,13048,5137,2629,2261,15141,398,21.65,57,45.089858,39.074724,11\n2026-04-20 17:25:00,7438,6138,3807,9086,12136,12887,5320,2717,2277,19019,387,21.91,55,45.088619,39.075748,12\n2026-04-20 17:25:15,7804,6222,3847,8959,12305,12583,5179,2649,2298,19027,399,21.71,58,45.088475,39.076283,11\n2026-04-20 17:25:30,7639,6430,3791,9338,12091,12621,5295,2604,2296,18963,426,22.00,55,45.087190,39.077590,11\n2026-04-20 17:25:45,7701,6325,3782,9389,11993,12911,5036,2640,2329,15195,417,21.71,57,45.086818,39.078440,12\n2026-04-20 17:26:00,7877,6213,3831,9467,12095,12709,5334,2668,2326,15139,405,22.06,55,45.085307,39.077500,13\n2026-04-20 17:26:15,7753,6274,3892,9217,12078,13045,5056,2627,2404,15144,409,22.07,57,45.084538,39.079148,11\n2026-04-20 17:26:30,7582,6453,3795,9371,12067,12839,5139,2636,2330,15197,369,22.10,57,45.083218,39.079891,12\n2026-04-20 17:26:45,7855,6421,4044,9307,12188,13072,5087,2680,2374,19046,431,21.91,56,45.083099,39.078849,11\n2026-04-20 17:27:00,8095,6564,3956,9228,11927,13134,5085,2779,2370,18973,397,22.26,58,45.082114,39.079786,10\n2026-04-20 17:27:15,7720,6342,3857,9261,11970,13030,5280,2709,2417,18979,431,22.06,58,45.081313,39.081188,11\n2026-04-20 17:27:30,8007,6539,4104,9168,12302,12865,5257,2679,2375,15227,423,22.08,56,45.080134,39.081840,12\n2026-04-20 17:27:45,7721,6444,4050,9126,12156,13131,5261,2700,2424,15205,396,22.35,56,45.079812,39.081242,12\n2026-04-20 17:28:00,7773,6290,4155,9647,11958,12961,5226,2778,2390,19020,360,22.25,58,45.078415,39.083148,12\n2026-04-20 17:28:15,7958,6420,3887,9343,12155,13048,5466,2745,2461,15212,406,22.39,55,45.078734,39.081759,11\n2026-04-20 17:28:30,8108,6415,3987,9642,12609,12783,5395,2695,2479,15164,371,22.22,56,45.077525,39.083584,13\n2026-04-20 17:28:45,7919,6356,4098,9605,12525,13181,5314,2752,2424,15270,371,22.61,57,45.076208,39.084261,11\n2026-04-20 17:29:00,8240,6381,4156,9257,12517,13119,5457,2769,2447,15151,354,22.68,55,45.076224,39.084227,12\n2026-04-20 17:29:15,7799,6405,4129,9351,12620,13275,5422,2743,2409,15271,433,22.47,55,45.075675,39.084923,11\n2026-04-20 17:29:30,7894,6407,4246,9636,12701,13234,5363,2783,2501,19067,370,22.72,55,45.074997,39.084818,13\n2026-04-20 17:29:45,8196,6314,4216,9605,12067,13291,5509,2695,2475,15184,371,22.64,55,45.074387,39.084512,12\n2026-04-20 17:30:00,8265,6413,4019,9800,12576,13052,5294,2725,2537,15183,421,22.81,56,45.072532,39.085924,12\n2026-04-20 17:30:15,8102,6635,4074,9644,12367,13136,5349,2774,2522,15238,408,22.83,56,45.073086,39.085632,13\n2026-04-20 17:30:30,8288,6402,4226,9730,12104,12939,5442,2709,2538,15200,359,22.56,55,45.071546,39.086596,13\n2026-04-20 17:30:45,7868,6422,3998,9587,12450,12803,5436,2749,2504,15212,368,22.92,56,45.071834,39.087530,11\n2026-04-20 17:31:00,8187,6687,4191,9758,12658,13130,5361,2794,2550,15204,362,22.83,56,45.069802,39.086070,12\n2026-04-20 17:31:15,8365,6397,4042,9669,12326,13292,5573,2748,2547,15237,396,22.71,54,45.069859,39.087231,12\n2026-04-20 17:31:30,8268,6653,4186,9760,12366,13141,5267,2836,2518,15203,416,22.93,55,45.069966,39.087022,11\n2026-04-20 17:31:45,8008,6629,4075,9355,12540,13210,5547,2696,2523,15264,394,22.83,54,45.068000,39.088611,12\n2026-04-20 17:32:00,8043,6368,4211,9723,12471,13251,5465,2790,2492,15158,415,22.97,53,45.068547,39.088771,11\n2026-04-20 17:32:15,8366,6632,4333,9377,12832,12956,5474,2791,2488,15210,348,22.97,56,45.067835,39.088827,11\n2026-04-20 17:32:30,8021,6460,4338,9847,12633,12882,5279,2707,2533,15170,401,23.05,54,45.066605,39.090012,11\n2026-04-20 17:32:45,8137,6641,4159,9437,12558,13106,5618,2795,2593,15145,374,23.03,56,45.065265,39.088809,12\n2026-04-20 17:33:00,8454,6700,4077,9537,12610,13093,5346,2678,2573,15146,408,23.31,53,45.064926,39.090433,13\n2026-04-20 17:33:15,8101,6591,4154,9493,12373,13162,5447,2731,2534,15172,392,23.31,56,45.064611,39.090546,11\n2026-04-20 17:33:30,8560,6553,4402,9829,12332,13289,5475,2714,2547,15240,348,23.23,52,45.062550,39.090652,11\n2026-04-20 17:33:45,8275,6539,4451,9598,12398,13035,5502,2776,2620,15200,363,23.42,52,45.062615,39.090404,12\n2026-04-20 17:34:00,8362,6665,4349,9481,12758,12964,5477,2700,2606,15226,376,23.24,54,45.061568,39.092295,11\n2026-04-20 17:34:15,8365,6715,4485,9702,12958,13023,5535,2827,2627,15255,386,23.50,54,45.060387,39.091700,13\n2026-04-20 17:34:30,8463,6440,4200,9910,12400,12849,5394,2689,2550,15195,418,23.36,53,45.060139,39.092846,12\n2026-04-20 17:34:45,8515,6717,4218,10092,12355,13105,5464,2842,2630,15227,405,23.46,53,45.058430,39.092974,11\n2026-04-20 17:35:00,8369,6595,4368,9941,12487,12868,5552,2739,2624,15235,385,23.59,54,45.058801,39.093424,11\n2026-04-20 17:35:15,8251,6722,4372,10029,12867,13049,5712,2777,2607,15236,354,23.67,52,45.057519,39.093405,12\n2026-04-20 17:35:30,8609,6427,4242,9577,12616,12810,5610,2782,2632,15211,361,23.45,53,45.056288,39.093957,13\n2026-04-20 17:35:45,8326,6485,4418,9802,12904,12954,5458,2711,2622,15140,407,23.64,51,45.055826,39.093917,12\n2026-04-20 17:36:00,8351,6726,4364,9627,12454,12963,5470,2808,2636,15207,352,23.57,55,45.054170,39.094857,13\n2026-04-20 17:36:15,8625,6602,4378,9580,12852,12929,5741,2740,2621,15196,414,23.87,52,45.052780,39.096043,11\n2026-04-20 17:36:30,8454,6722,4273,9848,13033,13091,5608,2691,2652,15135,408,23.84,52,45.052297,39.095990,12\n2026-04-20 17:36:45,8522,6494,4497,10026,12417,12912,5746,2700,2575,15258,391,23.63,55,45.050856,39.097259,11\n2026-04-20 17:37:00,8370,6548,4408,10071,12999,12660,5477,2732,2654,15211,355,23.73,53,45.050236,39.097649,11\n2026-04-20 17:37:15,8693,6480,4252,10142,12618,12721,5530,2673,2584,15216,336,24.01,51,45.050211,39.097338,12\n2026-04-20 17:37:30,8262,6471,4251,9655,12975,12916,5753,2791,2590,15253,342,24.09,52,45.048991,39.097208,12\n2026-04-20 17:37:45,8598,6553,4368,9902,12449,13141,5776,2658,2629,15177,347,23.89,52,45.047864,39.098110,12\n2026-04-20 17:38:00,8718,6583,4400,10217,12699,12876,5489,2672,2680,15192,388,23.90,53,45.046071,39.098634,12\n2026-04-20 17:38:15,8609,6437,4493,10126,12495,13041,5541,2782,2694,15159,363,23.84,52,45.045353,39.098710,11\n2026-04-20 17:38:30,8238,6737,4465,9796,12573,12798,5634,2703,2615,11327,383,24.17,54,45.045229,39.098773,10\n2026-04-20 17:38:45,8213,6460,4300,10035,12908,12659,5622,2778,2579,15138,396,24.25,54,45.044589,39.100366,11\n2026-04-20 17:39:00,8672,6449,4331,10063,12721,12879,5652,2659,2597,15125,391,23.98,51,45.043614,39.101206,13\n2026-04-20 17:39:15,8560,6507,4620,10106,12507,12669,5606,2787,2675,15134,393,24.33,51,45.041633,39.099719,10\n2026-04-20 17:39:30,8670,6538,4436,10284,12628,12721,5722,2675,2685,11343,395,24.17,54,45.041561,39.099331,12\n2026-04-20 17:39:45,8775,6515,4623,10089,13117,12645,5623,2767,2708,15211,362,24.27,52,45.039713,39.099219,11\n2026-04-20 17:40:00,8803,6549,4403,9850,12596,12598,5699,2803,2741,15179,394,24.16,51,45.039611,39.098462,11\n2026-04-20 17:40:15,8702,6640,4686,9930,13171,13014,5603,2781,2759,15141,375,24.16,51,45.038108,39.097687,13\n2026-04-20 17:40:30,8524,6698,4727,10317,13210,12781,5656,2726,2772,11413,388,24.33,53,45.038720,39.097293,11\n2026-04-20 17:40:45,8755,6542,4543,10366,12742,12928,5676,2857,2779,15181,381,24.52,53,45.037374,39.094960,12\n2026-04-20 17:41:00,8524,6634,4808,10333,13217,12923,5844,2850,2750,11331,372,24.41,53,45.036379,39.095885,11\n2026-04-20 17:41:15,8845,6545,4656,9979,12763,12932,5864,2846,2771,15258,390,24.67,51,45.035772,39.095017,11\n2026-04-20 17:41:30,8864,6874,4604,10392,13169,13256,5709,2820,2773,11338,375,24.32,54,45.034801,39.092929,13\n2026-04-20 17:41:45,8934,6886,4663,10511,13168,13251,5763,2764,2793,15258,396,24.78,53,45.033792,39.092978,11\n2026-04-20 17:42:00,8862,6887,4801,10369,13167,13185,6072,2780,2814,15156,324,24.76,51,45.032824,39.091258,12\n2026-04-20 17:42:15,8799,6861,4795,10178,13479,13006,5927,2884,2882,11358,331,24.65,51,45.032601,39.091420,13\n2026-04-20 17:42:30,9024,6889,4945,10375,13219,13101,5928,2823,2846,11332,337,24.60,53,45.031056,39.090927,12\n2026-04-20 17:42:45,8999,6656,4935,10758,13230,13084,5897,2811,2958,15222,322,24.53,53,45.030729,39.089044,12\n2026-04-20 17:43:00,9207,6784,5028,10643,13175,13164,6043,2842,2916,15262,377,24.86,51,45.031027,39.088022,12\n2026-04-20 17:43:15,9045,6979,5010,10252,12943,13453,5950,2786,2951,11410,332,24.88,51,45.030307,39.088877,11\n2026-04-20 17:43:30,9470,6720,4885,10486,13593,13237,5979,2948,2951,11353,347,24.98,50,45.029201,39.086300,11\n2026-04-20 17:43:45,9224,6854,5122,10598,13217,13168,6112,2807,2926,15160,363,24.69,53,45.028482,39.087290,12\n2026-04-20 17:44:00,9450,7029,5184,10988,13287,13347,6209,2881,2949,11388,333,24.76,53,45.026758,39.085096,12\n2026-04-20 17:44:15,9324,6947,5145,10651,13631,13313,6071,2906,3007,11464,355,24.82,52,45.025809,39.084293,11\n2026-04-20 17:44:30,9252,7104,5246,10782,13674,13420,6072,2960,3069,11347,352,25.11,50,45.025687,39.084200,11\n2026-04-20 17:44:45,9198,6933,5265,11020,13418,13657,6094,2880,3050,11425,319,25.11,49,45.024791,39.083093,12\n2026-04-20 17:45:00,9475,6891,5042,10824,13764,13192,6263,2885,3068,15219,363,25.00,49,45.023068,39.081624,13\n2026-04-20 17:45:15,9348,7009,5299,10754,13855,13251,6078,2891,3081,11375,368,24.89,51,45.023312,39.081961,12\n2026-04-20 17:45:30,9290,6813,5067,11029,13595,13296,6308,2914,3076,11347,324,25.23,49,45.022465,39.080958,13\n2026-04-20 17:45:45,9275,6945,5222,10714,13545,13267,6046,2924,3128,11393,364,25.03,50,45.021223,39.079182,12\n2026-04-20 17:46:00,9568,6982,5357,10894,13702,13599,6246,2942,3092,11398,327,25.12,50,45.021013,39.079434,12\n2026-04-20 17:46:15,9581,7170,5258,10832,13717,13349,6256,2894,3126,11455,354,25.04,49,45.019416,39.077807,11\n2026-04-20 17:46:30,9390,7050,5455,11119,13825,13552,6170,2945,3168,11435,344,25.05,48,45.018169,39.077405,12\n2026-04-20 17:46:45,9826,7179,5481,11125,13595,13657,6045,2987,3136,11343,299,25.44,51,45.017343,39.077391,11\n2026-04-20 17:47:00,9688,7203,5503,11376,13570,13763,6253,2944,3149,11407,321,25.27,50,45.017028,39.075541,12\n2026-04-20 17:47:15,9586,7100,5275,11415,13439,13643,6154,3032,3099,11364,355,25.36,49,45.015371,39.074958,13\n2026-04-20 17:47:30,9756,7002,5277,11154,14022,13407,6378,3005,3111,11409,328,25.38,49,45.014138,39.074552,11\n2026-04-20 17:47:45,9756,7240,5570,11210,13751,13558,6141,3046,3225,11379,372,25.26,50,45.013996,39.072927,13\n2026-04-20 17:48:00,9842,6946,5543,11381,13837,13253,6424,3024,3213,11403,290,25.56,50,45.013504,39.073484,13\n2026-04-20 17:48:15,9440,7111,5508,11466,13939,13660,6232,2998,3183,11331,324,25.50,48,45.012203,39.073043,12\n2026-04-20 17:48:30,9985,7216,5658,11284,14215,13332,6361,2924,3239,11368,363,25.31,48,45.010690,39.070838,13\n2026-04-20 17:48:45,9754,6992,5655,11579,14145,13724,6162,2911,3188,11430,300,25.46,50,45.010935,39.070372,11\n2026-04-20 17:49:00,9877,7114,5632,10982,13956,13479,6274,2993,3130,11465,312,25.55,52,45.009774,39.071282,13\n2026-04-20 17:49:15,9962,7233,5464,11443,14010,13273,6451,2925,3180,11367,348,25.82,48,45.008382,39.069605,11\n2026-04-20 17:49:30,9959,7085,5582,11484,13770,13601,6507,2942,3243,11393,363,25.69,49,45.008402,39.068617,11\n2026-04-20 17:49:45,9892,6920,5420,11446,14074,13123,6200,2915,3213,11442,320,25.76,47,45.006993,39.069561,13\n2026-04-20 17:50:00,9805,7179,5406,11602,13699,13121,6452,2973,3169,11449,350,25.92,47,45.006314,39.068223,13\n2026-04-20 17:50:15,9619,7208,5428,11389,14206,13432,6329,2991,3161,11453,322,25.53,50,45.004971,39.067896,10\n2026-04-20 17:50:30,9771,6885,5662,11570,13796,13294,6265,2868,3172,11400,321,25.87,51,45.004573,39.066863,10\n2026-04-20 17:50:45,9717,6990,5717,11106,14146,13245,6228,2994,3175,11347,343,25.72,48,45.002830,39.065519,10\n2026-04-20 17:51:00,9956,7023,5536,11559,14215,13182,6227,2882,3245,11403,293,25.67,48,45.002487,39.065553,13\n2026-04-20 17:51:15,9715,6937,5490,11564,14170,13151,6514,2866,3141,11368,339,25.69,49,45.001860,39.066069,11\n2026-04-20 17:51:30,9650,6926,5475,11250,13918,13342,6360,2924,3183,11447,319,25.97,48,45.001272,39.065038,11\n2026-04-20 17:51:45,9792,7210,5754,11440,14302,13071,6300,2850,3211,11420,316,25.88,49,45.001315,39.064360,12\n2026-04-20 17:52:00,9985,7144,5651,11180,13884,12976,6416,2911,3174,11393,345,25.76,48,44.999315,39.062968,13\n2026-04-20 17:52:15,9605,6886,5568,11313,14233,13081,6234,2935,3157,11353,275,26.07,50,44.999850,39.062346,12\n2026-04-20 17:52:30,9907,6931,5615,11130,14177,13455,6268,2954,3150,7649,289,25.83,51,44.998738,39.062766,12\n2026-04-20 17:52:45,9960,7062,5446,11685,14113,13116,6293,2915,3151,11372,267,25.86,47,44.997376,39.061395,10\n2026-04-20 17:53:00,9811,6910,5720,11376,13968,12943,6342,2846,3161,11336,277,25.84,48,44.997456,39.060509,11\n2026-04-20 17:53:15,9992,7175,5787,11462,14003,12970,6208,2910,3173,11352,297,25.94,51,44.997120,39.060783,10\n2026-04-20 17:53:30,9532,6946,5568,11617,13629,13263,6276,2901,3209,11355,319,26.04,50,44.995466,39.061071,10\n2026-04-20 17:53:45,9997,7102,5676,11593,14184,12963,6440,2808,3115,11473,266,25.93,48,44.995023,39.060158,11\n2026-04-20 17:54:00,9668,7145,5654,11325,13952,13033,6487,2923,3203,11441,308,26.16,48,44.995291,39.060102,11\n2026-04-20 17:54:15,9694,6957,5607,11611,14320,12788,6295,2845,3204,7596,322,26.37,47,44.993189,39.058438,12\n2026-04-20 17:54:30,10028,7050,5575,11357,13679,12910,6437,2882,3198,11333,305,26.08,50,44.993328,39.057493,12\n2026-04-20 17:54:45,9867,7110,5793,11289,13776,13092,6397,2796,3150,11362,284,26.14,48,44.992510,39.057468,11\n2026-04-20 17:55:00,9767,6891,5578,11201,13826,12885,6251,2869,3187,7667,257,26.21,50,44.992058,39.057129,10\n2026-04-20 17:55:15,9872,6861,5788,11423,14192,13276,6502,2934,3222,11464,282,26.19,50,44.992184,39.056153,11\n2026-04-20 17:55:30,9733,6985,5748,11194,13961,13074,6505,2872,3191,7566,268,26.23,46,44.991455,39.055707,12\n2026-04-20 17:55:45,9741,7011,5607,11308,14210,12924,6428,2901,3157,7543,258,26.12,51,44.990008,39.053091,12\n2026-04-20 17:56:00,9951,7044,5756,11449,13836,12940,6360,2882,3179,11330,249,26.19,48,44.989829,39.053239,11\n2026-04-20 17:56:15,9785,6838,5824,11499,14016,13075,6307,2929,3193,11436,288,26.50,48,44.989469,39.050845,13\n2026-04-20 17:56:30,9733,7053,5641,11755,14236,12954,6289,2847,3179,11453,270,26.24,48,44.988283,39.050377,13\n2026-04-20 17:56:45,9966,6900,5593,11645,13892,12928,6251,2798,3127,7560,278,26.43,48,44.987578,39.049466,10\n2026-04-20 17:57:00,9911,6967,5891,11777,14220,13060,6375,2885,3227,7626,309,26.56,49,44.987626,39.047203,12\n2026-04-20 17:57:15,9701,7145,5685,11455,13914,12899,6426,2947,3157,11421,262,26.30,46,44.986747,39.047317,12\n2026-04-20 17:57:30,9717,6869,5646,11515,14250,13035,6238,2907,3229,11378,303,26.44,49,44.986254,39.045027,12\n2026-04-20 17:57:45,9673,7052,5761,11772,13974,12932,6281,2956,3261,11413,267,26.32,49,44.986249,39.044209,11\n2026-04-20 17:58:00,9931,6874,5785,11934,14191,12914,6361,2812,3174,7662,309,26.50,46,44.985628,39.043559,12\n2026-04-20 17:58:15,10043,6843,5894,11365,14296,12774,6420,2929,3201,7628,280,26.62,50,44.984807,39.042175,13\n2026-04-20 17:58:30,10038,7069,5703,11761,14247,12916,6337,2905,3210,7578,268,26.43,47,44.983577,39.041967,12\n2026-04-20 17:58:45,9672,7007,5606,11575,14031,12589,6447,2769,3184,11454,285,26.38,48,44.982261,39.040680,12\n2026-04-20 17:59:00,10022,7081,5668,11548,14351,12561,6481,2907,3128,7596,276,26.63,47,44.982119,39.038946,12\n2026-04-20 17:59:15,9772,6915,5954,11716,14140,12972,6388,2860,3176,7616,269,26.62,48,44.981748,39.036961,11\n2026-04-20 17:59:30,9664,7002,5903,11413,13887,12692,6548,2837,3195,7528,224,26.69,45,44.981100,39.036979,12\n2026-04-20 17:59:45,9948,7066,5746,11499,14496,12860,6517,2767,3181,7567,236,26.81,48,44.979528,39.035027,12\n2026-04-20 18:00:00,9450,6848,5715,11595,14019,12929,6383,2757,3143,7538,285,26.64,50,44.978606,39.033421,12\n2026-04-20 18:00:15,9754,6860,5731,11428,14180,12974,6333,2846,3214,7634,283,26.88,49,44.979166,39.032725,11\n2026-04-20 18:00:30,9654,7032,5915,11410,14070,12717,6413,2832,3203,7631,227,26.89,48,44.978168,39.031440,12\n2026-04-20 18:00:45,9898,6855,5723,11350,13841,12678,6410,2776,3103,7537,280,26.61,46,44.977003,39.031693,11\n2026-04-20 18:01:00,9551,7157,5952,11530,14481,12809,6328,2787,3110,11457,225,26.71,47,44.976950,39.029440,12\n2026-04-20 18:01:15,9574,7188,5711,11798,14480,12580,6381,2774,3126,7585,223,26.91,47,44.976133,39.029034,12\n2026-04-20 18:01:30,9761,6915,5727,11909,14106,12603,6399,2865,3179,7620,279,26.68,49,44.975135,39.026802,10\n2026-04-20 18:01:45,9526,7049,5698,11521,14084,12341,6255,2767,3086,7598,235,26.75,49,44.975008,39.026894,12\n2026-04-20 18:02:00,9785,6932,5656,11442,13943,12439,6361,2770,3151,7648,235,26.94,46,44.973319,39.024724,13\n2026-04-20 18:02:15,9446,7019,5682,11361,14362,12358,6261,2807,3111,7537,256,26.73,49,44.973934,39.023593,11\n2026-04-20 18:02:30,9597,6929,5751,11338,13764,12152,6153,2782,3097,7620,245,26.68,48,44.972697,39.022563,13\n2026-04-20 18:02:45,9485,7215,5851,11734,13891,12670,6092,2840,3108,7568,214,26.75,48,44.972647,39.023421,10\n2026-04-20 18:03:00,9445,6972,5583,11588,13773,12588,6180,2781,3144,7562,228,26.70,46,44.971924,39.022054,12\n2026-04-20 18:03:15,9284,6949,5669,11438,13702,12487,6042,2695,3080,7659,216,27.05,47,44.970256,39.020149,13\n2026-04-20 18:03:30,9253,7155,5651,11532,13938,12147,6204,2668,3043,7664,256,26.70,46,44.969690,39.019647,11\n2026-04-20 18:03:45,9644,7028,5615,11366,14219,12418,5990,2677,3073,7668,212,27.05,47,44.969431,39.019167,12\n2026-04-20 18:04:00,9264,7019,5532,11169,14211,12001,6086,2676,3047,7595,211,26.71,49,44.969348,39.017591,13\n2026-04-20 18:04:15,9370,7273,5703,11737,13842,12109,6088,2788,3073,7647,262,26.96,47,44.969072,39.015886,13\n2026-04-20 18:04:30,9548,7366,5618,11204,13811,12357,6238,2687,3075,7525,194,26.78,49,44.967577,39.015746,12\n2026-04-20 18:04:45,9401,7259,5772,11228,13708,11918,6197,2668,3060,7578,242,26.97,47,44.967837,39.013548,11\n2026-04-20 18:05:00,9234,7191,5708,11478,13990,12058,5979,2717,3035,7578,209,27.10,46,44.966880,39.013808,10\n2026-04-20 18:05:15,9136,7359,5393,11085,13851,12075,5906,2684,3056,7578,183,26.82,49,44.965219,39.012469,11\n2026-04-20 18:05:30,9134,7346,5557,11525,13872,12194,6214,2595,2975,7606,199,26.78,47,44.965202,39.011839,13\n2026-04-20 18:05:45,9458,7449,5460,11235,14005,11992,6046,2642,3080,7670,189,27.11,49,44.965331,39.010687,12\n2026-04-20 18:06:00,8980,7534,5577,11053,13914,12123,6066,2614,3029,7540,188,26.94,48,44.964919,39.009028,12\n2026-04-20 18:06:15,9096,7375,5606,11324,13619,12003,5993,2545,2937,7659,239,26.85,46,44.962720,39.008487,12\n2026-04-20 18:06:30,9260,7555,5583,11500,13547,12157,5955,2573,2957,7582,190,27.04,49,44.963509,39.006824,13\n2026-04-20 18:06:45,8806,7506,5391,11173,14071,12046,5992,2561,2995,7634,202,26.94,46,44.962088,39.005920,12\n2026-04-20 18:07:00,8897,7708,5310,11294,13606,11834,6120,2596,3030,3866,240,27.18,49,44.962417,39.003875,13\n2026-04-20 18:07:15,9112,7434,5388,11171,13570,11641,5912,2647,2941,7598,210,27.05,49,44.961238,39.004020,11\n2026-04-20 18:07:30,9164,7710,5460,11266,13986,11821,5785,2617,2948,7616,205,27.15,49,44.960525,39.003317,11\n2026-04-20 18:07:45,8673,7762,5228,11046,13316,11596,5831,2625,2963,7583,209,26.82,49,44.959789,39.001705,12\n2026-04-20 18:08:00,9164,7532,5451,10833,13705,11468,5900,2595,2928,7529,213,27.20,47,44.959710,38.999695,12\n2026-04-20 18:08:15,8584,7789,5325,10838,13744,11399,5854,2620,2939,3769,212,27.08,48,44.958208,38.998127,11\n2026-04-20 18:08:30,8666,7893,5445,10722,13469,11444,5678,2622,2961,7617,232,27.08,47,44.957932,38.997727,12\n2026-04-20 18:08:45,8514,7705,5278,11015,13298,11527,5837,2451,2857,3794,224,26.95,46,44.956434,38.997241,12\n2026-04-20 18:09:00,8601,7756,5240,10704,13817,11467,5693,2549,2858,7567,178,26.85,49,44.956516,38.994683,13\n2026-04-20 18:09:15,8869,7913,5061,10908,13649,11688,5572,2517,2878,7603,174,27.19,46,44.955168,38.994602,13\n2026-04-20 18:09:30,8469,7878,5113,10915,13289,11613,5722,2562,2866,7572,188,26.93,46,44.954600,38.992996,13\n2026-04-20 18:09:45,8796,7785,5034,10789,13525,11245,5853,2519,2779,7634,169,27.26,48,44.953527,38.992123,11\n2026-04-20 18:10:00,8551,8099,5046,10976,13579,11615,5827,2508,2832,7581,166,27.06,48,44.953316,38.991167,12\n2026-04-20 18:10:15,8633,7915,5151,10575,13503,11332,5537,2424,2808,7675,203,26.84,48,44.951875,38.989121,13\n2026-04-20 18:10:30,8287,7858,5014,10847,13514,11442,5792,2391,2777,7580,175,27.21,46,44.951700,38.987942,12\n2026-04-20 18:10:45,8303,8191,4953,10683,13469,11071,5563,2380,2785,3768,175,26.85,48,44.951063,38.986745,11\n2026-04-20 18:11:00,8433,8053,4937,10640,13174,11224,5635,2490,2711,7635,168,27.10,49,44.949524,38.985237,11\n2026-04-20 18:11:15,8384,7910,4813,10396,12803,11188,5602,2327,2740,3761,198,26.93,46,44.947889,38.983866,12\n2026-04-20 18:11:30,8149,8242,4873,10364,13184,11266,5584,2472,2715,7594,174,26.85,48,44.948202,38.981536,12\n2026-04-20 18:11:45,8431,7998,4907,10092,13377,11361,5401,2335,2735,7556,143,26.99,47,44.948011,38.980951,13\n2026-04-20 18:12:00,8126,8325,4839,10615,12988,11373,5490,2357,2790,3821,164,26.97,49,44.949172,38.978244,13\n2026-04-20 18:12:15,8377,7989,4955,10188,13346,10972,5660,2409,2699,7542,169,27.24,46,44.948723,38.976591,12\n2026-04-20 18:12:30,8004,8339,4832,10098,12875,10951,5323,2383,2711,3829,132,27.14,49,44.948586,38.975545,13\n2026-04-20 18:12:45,8415,8268,4819,10697,13248,11105,5631,2356,2715,3828,149,27.17,45,44.949983,38.973901,12\n2026-04-20 18:13:00,8075,8272,4881,10712,13365,11445,5410,2510,2795,3776,130,26.95,46,44.950697,38.973177,12\n2026-04-20 18:13:15,8440,8321,4986,10831,13186,11124,5500,2384,2819,7535,164,26.89,50,44.951088,38.970060,13\n2026-04-20 18:13:30,8387,8153,4825,10341,12818,11225,5402,2380,2762,3874,148,27.07,49,44.950188,38.968945,12\n2026-04-20 18:13:45,8406,8291,5012,10710,13002,11331,5507,2367,2781,3850,148,27.16,49,44.951013,38.968242,13\n2026-04-20 18:14:00,8232,8374,5054,10263,13252,11365,5416,2503,2761,3765,159,26.94,50,44.951236,38.966744,13\n2026-04-20 18:14:15,8438,8174,5142,10570,13011,10962,5420,2491,2788,7661,136,27.12,47,44.951868,38.964770,12\n2026-04-20 18:14:30,8349,8231,5081,10546,13175,10993,5566,2402,2724,3816,177,27.34,45,44.952257,38.962570,13\n2026-04-20 18:14:45,8284,8280,5044,10835,13319,11506,5426,2501,2803,3867,170,27.13,46,44.954057,38.960464,13\n2026-04-20 18:15:00,8474,8181,5012,10556,13488,11243,5647,2508,2773,3775,167,26.97,49,44.954185,38.959277,13\n2026-04-20 18:15:15,8500,8307,5019,10771,13139,11490,5438,2534,2745,3744,126,27.02,50,44.954410,38.958882,13\n2026-04-20 18:15:30,8157,8192,5007,10894,13268,11504,5493,2460,2825,3819,116,27.12,46,44.955393,38.955786,12\n2026-04-20 18:15:45,8196,8298,5127,10629,13649,11501,5395,2494,2749,3790,153,27.22,48,44.955743,38.954982,11\n2026-04-20 18:16:00,8498,8079,5025,10737,13494,11238,5390,2463,2785,3756,125,27.01,48,44.955854,38.952869,13\n2026-04-20 18:16:15,8214,8158,5332,10888,13584,11080,5589,2578,2841,3854,153,27.20,47,44.957310,38.952730,11\n2026-04-20 18:16:30,8403,8116,5232,10980,13666,11477,5633,2573,2791,3821,134,27.22,47,44.957419,38.950946,13\n2026-04-20 18:16:45,8689,8223,5364,10904,13664,11573,5655,2464,2782,3757,137,27.14,46,44.958368,38.948948,13\n2026-04-20 18:17:00,8275,8066,5305,10721,13224,11488,5660,2541,2800,3837,153,27.11,48,44.959038,38.946535,12\n2026-04-20 18:17:15,8606,7871,5157,11110,13440,11049,5646,2446,2728,3770,127,27.34,48,44.958269,38.945935,13\n2026-04-20 18:17:30,8598,7922,5304,10635,13350,11008,5609,2468,2738,3779,118,27.32,46,44.959221,38.944048,13\n2026-04-20 18:17:45,8219,7918,5283,11123,13398,11251,5519,2563,2731,3837,139,27.12,49,44.959874,38.942621,13\n2026-04-20 18:18:00,8356,7818,5153,10816,13835,11535,5648,2485,2717,3792,157,27.28,48,44.960459,38.940616,13\n2026-04-20 18:18:15,8505,7730,5295,11129,13166,11093,5437,2580,2764,3840,128,27.31,46,44.960527,38.940879,11\n2026-04-20 18:18:30,8404,7843,5464,11335,13851,11424,5419,2559,2794,3785,144,27.02,49,44.962494,38.938089,12\n2026-04-20 18:18:45,8247,7597,5219,11152,13638,11580,5655,2465,2717,3812,132,27.23,47,44.962799,38.936909,12\n2026-04-20 18:19:00,8517,7649,5172,11043,13718,11414,5493,2561,2772,3867,135,27.22,48,44.962920,38.935075,12\n2026-04-20 18:19:15,8578,7342,5206,11181,13516,11465,5415,2512,2682,3768,127,26.91,48,44.963826,38.933355,12\n2026-04-20 18:19:30,8536,7598,5250,10861,13373,11455,5551,2501,2747,3732,131,27.06,48,44.964321,38.933020,12\n2026-04-20 18:19:45,8354,7258,5324,11045,13632,11205,5638,2465,2726,3796,135,26.99,49,44.964471,38.931518,11\n2026-04-20 18:20:00,8450,7194,5346,10926,13886,11188,5498,2456,2697,3819,132,27.12,48,44.964600,38.929348,12\n2026-04-20 18:20:15,8545,7311,5471,11370,13281,11225,5428,2510,2692,3839,105,27.10,48,44.966138,38.928767,12\n2026-04-20 18:20:30,8588,7054,5351,10866,13305,11483,5355,2518,2728,3745,96,26.92,49,44.966607,38.926860,13\n2026-04-20 18:20:45,8565,7102,5467,11084,13325,11495,5386,2508,2655,3742,95,26.93,50,44.966158,38.925616,13\n2026-04-20 18:21:00,8077,7053,5169,10981,13489,11369,5427,2497,2604,3758,111,27.03,48,44.966490,38.923768,12\n2026-04-20 18:21:15,8394,7200,5202,11138,13460,11493,5386,2573,2577,3826,145,27.12,46,44.967932,38.922463,12\n2026-04-20 18:21:30,8342,6950,5393,11001,13501,11486,5267,2455,2565,3870,116,26.99,47,44.967562,38.920295,12\n2026-04-20 18:21:45,8244,6795,5477,10873,13258,11289,5274,2601,2528,3775,147,27.00,48,44.968368,38.919098,12\n2026-04-20 18:22:00,8406,6951,5398,10678,13245,11144,5567,2526,2560,3809,101,26.86,49,44.968423,38.918691,11\n2026-04-20 18:22:15,8319,6814,5176,10793,13821,11372,5592,2588,2576,3783,73,27.10,47,44.969162,38.917130,11\n2026-04-20 18:22:30,8404,6671,5229,11044,13519,11348,5331,2447,2588,3770,133,27.09,48,44.969674,38.915146,12\n2026-04-20 18:22:45,8237,6814,5396,11163,13186,11108,5384,2512,2542,3867,97,27.25,47,44.970331,38.912522,11\n2026-04-20 18:23:00,8144,6540,5279,10709,13784,11362,5322,2549,2505,3772,109,27.07,47,44.971762,38.911345,12\n2026-04-20 18:23:15,8181,6740,5413,10995,13263,11244,5488,2451,2463,3873,119,27.07,50,44.972071,38.910070,12\n2026-04-20 18:23:30,7987,6717,5135,10856,13742,10966,5363,2429,2404,0,96,26.89,50,44.971364,38.908624,13\n2026-04-20 18:23:45,8361,6441,5299,11115,13509,11059,5291,2470,2473,0,124,27.18,48,44.972032,38.907640,12\n2026-04-20 18:24:00,8190,6581,5329,10591,13365,11248,5343,2455,2440,3849,109,27.00,47,44.972331,38.905742,12\n2026-04-20 18:24:15,8024,6318,5204,11035,13549,11336,5153,2493,2388,3826,88,26.85,47,44.973431,38.904101,13\n2026-04-20 18:24:30,8118,6251,5058,10950,12998,11294,5251,2538,2412,0,96,26.78,50,44.973493,38.902591,12\n2026-04-20 18:24:45,8112,6159,5225,10554,13425,11066,5229,2512,2371,0,108,26.94,49,44.973876,38.900833,12\n2026-04-20 18:25:00,7732,6249,5081,10799,13260,11150,5340,2472,2337,3726,77,26.95,49,44.974762,38.899191,12\n2026-04-20 18:25:15,7737,6196,5067,10732,13544,10962,5188,2459,2277,3840,117,26.96,48,44.975737,38.897940,13\n2026-04-20 18:25:30,7850,6041,4896,10396,13129,10774,5061,2384,2257,3746,74,26.97,49,44.976137,38.895159,12\n2026-04-20 18:25:45,7807,6144,5059,10535,12998,11218,5144,2453,2240,3849,85,26.73,49,44.977279,38.894432,11\n2026-04-20 18:26:00,7732,6055,5045,10606,13455,10726,5215,2480,2298,0,81,26.94,48,44.977431,38.893399,12\n2026-04-20 18:26:15,7680,6246,5081,10324,13164,10913,5083,2384,2210,0,72,26.82,46,44.978013,38.890606,11\n2026-04-20 18:26:30,8027,5931,5021,10678,13242,10671,5062,2502,2203,0,74,27.06,47,44.978742,38.889214,12\n2026-04-20 18:26:45,7840,6095,4770,10575,12895,10750,5260,2462,2180,32,105,26.72,47,44.979624,38.887501,11\n2026-04-20 18:27:00,7716,5867,4797,10615,13359,11034,5204,2414,2178,3827,86,26.69,49,44.980461,38.886011,13\n2026-04-20 18:27:15,7703,6044,4690,10661,12986,11080,5191,2382,2167,19,96,26.97,48,44.980665,38.884520,13\n2026-04-20 18:27:30,7428,6086,4862,10241,12750,10574,5040,2406,2141,0,115,27.04,48,44.980397,38.883295,13\n2026-04-20 18:27:45,7703,5986,4718,10158,12908,10876,5053,2473,2053,14,81,26.96,48,44.981733,38.883004,11\n2026-04-20 18:28:00,7598,5937,4861,10403,12883,11091,5003,2454,2114,37,85,26.68,50,44.982871,38.883216,12\n2026-04-20 18:28:15,7736,5769,4883,10465,13254,10861,5014,2496,2068,0,98,26.96,48,44.983997,38.883629,13\n2026-04-20 18:28:30,7600,6032,4929,10565,13333,11209,5014,2456,2111,45,85,26.86,50,44.984839,38.883336,12\n2026-04-20 18:28:45,7845,6024,4955,10504,13043,11211,5228,2368,2101,37,86,26.91,47,44.985976,38.883507,13\n2026-04-20 18:29:00,8024,5903,5224,10533,13111,10845,5010,2525,2073,3854,83,26.79,50,44.987170,38.885103,12\n2026-04-20 18:29:15,8136,5795,5194,10600,13284,10900,5121,2497,2164,0,78,26.68,49,44.988013,38.884977,11\n2026-04-20 18:29:30,7725,6092,5275,10541,13338,11190,5220,2544,2081,68,83,26.59,49,44.989104,38.886276,11\n2026-04-20 18:29:45,8198,6050,5144,10769,13617,10847,5076,2419,2083,56,88,26.70,49,44.989672,38.885559,13\n2026-04-20 18:30:00,7871,6022,5182,10784,13753,11310,5426,2505,2173,0,99,26.52,51,44.991048,38.886888,11\n2026-04-20 18:30:15,7804,5953,5421,10641,13366,10989,5117,2482,2164,0,93,26.94,49,44.992436,38.886055,11\n2026-04-20 18:30:30,8201,6099,5368,10834,13681,11036,5236,2547,2188,74,98,26.93,47,44.993734,38.887065,11\n2026-04-20 18:30:45,7951,5813,5556,10897,13411,11043,5381,2592,2193,0,80,26.74,47,44.994909,38.887307,12\n2026-04-20 18:31:00,8326,5814,5330,10954,13761,11491,5265,2624,2153,45,88,26.84,47,44.995473,38.887696,12\n2026-04-20 18:31:15,8370,6046,5320,11370,13652,11604,5263,2646,2171,39,81,26.53,50,44.996744,38.888273,13\n2026-04-20 18:31:30,8430,5833,5618,10987,13867,11332,5454,2614,2181,0,76,26.86,49,44.996568,38.889536,11\n2026-04-20 18:31:45,8155,5887,5636,11069,13844,11361,5355,2564,2196,0,83,26.87,51,44.998414,38.888896,13\n2026-04-20 18:32:00,8210,6093,5711,11125,13554,11498,5327,2614,2223,0,83,26.51,49,44.999002,38.890650,12\n2026-04-20 18:32:15,8541,6048,5700,11400,13891,11524,5512,2648,2139,0,81,26.76,49,44.999099,38.890259,11\n2026-04-20 18:32:30,8306,5978,5484,11451,13856,11726,5249,2602,2199,21,77,26.77,50,44.999810,38.890276,12\n2026-04-20 18:32:45,8414,6099,5567,11216,13721,11716,5255,2723,2212,0,83,26.39,49,45.001934,38.890735,13\n2026-04-20 18:33:00,8631,5910,5788,11443,13775,11715,5585,2686,2219,0,82,26.52,50,45.001510,38.892290,11\n2026-04-20 18:33:15,8261,6036,5807,11797,13650,11943,5636,2608,2177,0,76,26.39,50,45.003497,38.892664,11\n2026-04-20 18:33:30,8532,6135,5688,11537,14149,11517,5467,2740,2218,0,84,26.63,48,45.004371,38.892344,12\n2026-04-20 18:33:45,8251,6119,5736,11749,13851,11925,5332,2607,2239,0,73,26.39,50,45.003830,38.892370,12\n2026-04-20 18:34:00,8586,5908,5709,11317,14286,11952,5380,2700,2143,0,71,26.56,49,45.004731,38.892751,10\n2026-04-20 18:34:15,8421,5976,5790,11916,14386,11579,5498,2705,2239,0,74,26.65,48,45.006483,38.893971,10\n2026-04-20 18:34:30,8740,6133,5786,11438,13828,11851,5373,2703,2221,0,89,26.50,49,45.007585,38.893662,12\n2026-04-20 18:34:45,8814,6115,5781,11945,14338,11626,5451,2736,2252,2,72,26.35,50,45.007989,38.893862,13\n2026-04-20 18:35:00,8552,6083,5964,11878,14235,11827,5454,2702,2219,70,83,26.44,49,45.007968,38.894053,12\n2026-04-20 18:35:15,8667,6106,6090,11826,13905,12133,5444,2805,2195,0,79,26.24,49,45.009389,38.894577,12\n2026-04-20 18:35:30,8761,5957,6056,11622,14020,12168,5753,2694,2186,0,77,26.57,50,45.009209,38.896173,11\n2026-04-20 18:35:45,8881,5922,6012,12002,14071,12025,5722,2725,2236,25,87,26.42,51,45.010680,38.895855,13\n2026-04-20 18:36:00,8557,6124,6016,11649,14496,11906,5607,2795,2232,10,84,26.51,48,45.012085,38.896115,11\n2026-04-20 18:36:15,8727,6175,5990,11584,14060,12107,5474,2825,2233,41,81,26.42,52,45.011791,38.895713,12\n2026-04-20 18:36:30,8716,6078,6049,12054,14368,12075,5770,2747,2256,0,84,26.39,52,45.012599,38.897343,12\n2026-04-20 18:36:45,8835,6073,6197,11923,14606,11962,5551,2801,2197,71,79,26.37,52,45.014565,38.896382,12\n2026-04-20 18:37:00,8504,6105,5938,12172,14043,11914,5549,2739,2216,0,88,26.50,51,45.015407,38.896235,11\n2026-04-20 18:37:15,8709,6028,6131,11914,14447,12407,5649,2852,2290,0,77,26.44,52,45.015742,38.897027,12\n2026-04-20 18:37:30,8761,6177,6023,11842,14495,12371,5443,2874,2235,29,71,26.22,50,45.016150,38.896656,12\n2026-04-20 18:37:45,8908,6086,6202,12320,14188,12294,5755,2853,2284,0,87,26.14,53,45.017401,38.897872,11\n2026-04-20 18:38:00,8632,6024,6107,11998,14061,12435,5552,2811,2280,0,84,26.06,52,45.017927,38.897796,12\n2026-04-20 18:38:15,8857,6027,6118,12024,14464,12025,5584,2779,2250,31,82,26.12,53,45.019440,38.898607,11\n2026-04-20 18:38:30,9004,6125,6283,12260,14306,12534,5518,2897,2261,0,73,25.99,53,45.019609,38.897902,11\n2026-04-20 18:38:45,8920,6074,6270,12239,14428,12170,5481,2863,2287,0,75,26.12,49,45.021354,38.897464,12\n2026-04-20 18:39:00,8645,5994,6172,11751,14231,12309,5475,2814,2200,69,77,26.27,52,45.022342,38.897495,10\n2026-04-20 18:39:15,8581,6250,6206,12133,14412,12603,5779,2770,2208,0,79,26.16,51,45.023328,38.897833,12\n2026-04-20 18:39:30,8984,6337,6178,12115,14562,12571,5539,2952,2261,19,82,26.20,53,45.023942,38.899581,11\n2026-04-20 18:39:45,8719,6311,6155,12240,14392,12156,5774,2897,2266,17,73,26.10,53,45.025208,38.899042,10\n2026-04-20 18:40:00,8654,6183,6152,12015,14663,12495,5741,2945,2225,0,80,26.21,52,45.025375,38.899085,11\n2026-04-20 18:40:15,8951,6041,6122,11763,14120,12376,5700,2875,2213,0,77,25.88,51,45.027283,38.898347,11\n2026-04-20 18:40:30,8998,6236,6086,12096,14175,12614,5775,2824,2245,0,84,26.02,51,45.028049,38.900301,13\n2026-04-20 18:40:45,8518,6218,6040,11991,13966,12450,5524,2802,2237,68,76,25.92,52,45.029003,38.898979,11\n2026-04-20 18:41:00,8627,6029,6290,11862,14013,12638,5492,2874,2322,0,74,25.93,54,45.028897,38.899868,11\n2026-04-20 18:41:15,8622,6318,6311,11944,14172,12586,5543,2906,2247,26594,82,25.86,54,45.030386,38.900424,12\n2026-04-20 18:41:30,8841,6327,6114,12060,14540,12572,5772,2957,2256,26663,75,26.04,52,45.030506,38.899979,13\n2026-04-20 18:41:45,8772,6263,6040,11801,14129,12518,5693,2951,2292,26663,87,25.86,54,45.033037,38.901297,10\n2026-04-20 18:42:00,9029,6352,6199,12058,14516,12724,5533,2925,2352,26663,85,25.69,52,45.033111,38.901810,10\n2026-04-20 18:42:15,8890,6153,6274,11946,14596,12357,5799,2935,2345,26654,89,25.69,51,45.033262,38.901549,12\n2026-04-20 18:42:30,8663,6305,5923,12049,14134,12372,5637,2817,2330,26663,86,25.61,52,45.034700,38.900692,13\n2026-04-20 18:42:45,8670,6165,5893,12003,14381,12413,5442,2930,2286,26593,89,25.60,53,45.036157,38.900778,10\n2026-04-20 18:43:00,8683,6074,6161,12130,14463,12896,5726,2846,2289,26603,82,25.87,54,45.036412,38.901161,11\n2026-04-20 18:43:15,8963,6123,5908,11656,14307,12443,5575,2905,2329,26663,78,25.78,52,45.038061,38.901439,13\n2026-04-20 18:43:30,8959,6298,5965,11969,13923,12888,5480,2938,2313,26663,84,25.54,52,45.039298,38.903328,11\n2026-04-20 18:43:45,8558,6249,6138,11692,14265,12869,5573,2862,2342,26594,83,25.52,52,45.039888,38.903182,13\n2026-04-20 18:44:00,8921,6322,6149,11861,14387,12856,5666,2948,2330,26663,82,25.86,54,45.039985,38.902996,10\n2026-04-20 18:44:15,9025,6422,6088,11799,14076,12979,5763,2880,2285,26663,86,25.66,51,45.040043,38.905035,11\n2026-04-20 18:44:30,8676,6430,6245,12193,14576,12771,5511,2973,2309,26663,79,25.54,55,45.039982,38.906005,12\n2026-04-20 18:44:45,8859,6384,6150,11984,14193,13136,5653,2913,2371,26651,84,25.71,53,45.039198,38.906830,12\n2026-04-20 18:45:00,9187,6411,6374,12090,14216,13199,5908,3014,2373,26596,83,25.39,55,45.040627,38.908769,12\n2026-04-20 18:45:15,9086,6319,6206,12200,14732,13302,5693,3056,2383,26662,74,25.34,55,45.040291,38.910299,13\n2026-04-20 18:45:30,9229,6539,6334,12021,14553,12989,5728,2936,2380,26615,87,25.68,52,45.039305,38.910576,12\n2026-04-20 18:45:45,8935,6415,6373,12566,14439,12980,5858,2988,2418,26663,89,25.55,53,45.039532,38.911763,12\n2026-04-20 18:46:00,9109,6517,6381,12255,14858,13448,5928,3013,2417,26624,85,25.53,52,45.039367,38.913007,12\n2026-04-20 18:46:15,9320,6344,6380,12145,14319,13309,5840,3111,2476,26609,73,25.41,55,45.040381,38.915192,11\n2026-04-20 18:46:30,9132,6364,6615,12617,14631,13330,5809,3091,2522,26663,77,25.56,56,45.040725,38.916137,10\n2026-04-20 18:46:45,9196,6544,6378,12470,14455,13478,5794,3141,2527,26663,90,25.48,54,45.040600,38.916316,10\n2026-04-20 18:47:00,9091,6454,6722,12431,14655,13215,6091,3080,2580,26619,93,25.35,53,45.039203,38.918548,12\n2026-04-20 18:47:15,9578,6644,6471,12879,14690,13312,5860,3111,2603,26607,87,25.47,52,45.040335,38.919705,11\n2026-04-20 18:47:30,9134,6659,6543,12471,14750,13800,5876,3125,2635,26663,84,25.49,52,45.040429,38.920569,10\n2026-04-20 18:47:45,9351,6640,6811,12925,14574,13695,5899,3098,2565,26602,83,25.24,54,45.040291,38.921310,12\n2026-04-20 18:48:00,9485,6747,6590,12758,14896,13601,6134,3170,2662,26596,72,25.19,56,45.040308,38.922979,12\n2026-04-20 18:48:15,9581,6517,6628,12596,15074,13469,6196,3226,2602,26663,82,25.12,54,45.040492,38.923792,13\n2026-04-20 18:48:30,9779,6795,6617,12594,15318,13671,5894,3143,2713,26649,90,25.25,54,45.040990,38.925411,10\n2026-04-20 18:48:45,9769,6632,6636,12539,15074,13971,6211,3251,2737,26663,86,25.30,55,45.040658,38.925770,10\n2026-04-20 18:49:00,9648,6594,6757,12781,15009,13632,6139,3271,2666,26663,79,25.10,54,45.040441,38.927237,11\n2026-04-20 18:49:15,9720,6751,6776,13106,14817,13647,5941,3193,2770,26609,85,25.02,57,45.040407,38.928325,13\n2026-04-20 18:49:30,9879,6844,6999,13019,14989,14244,6187,3236,2765,26633,83,25.28,54,45.040759,38.930364,11\n2026-04-20 18:49:45,9800,6955,6969,13026,15134,14255,6325,3275,2742,26588,84,25.18,53,45.041125,38.931545,10\n2026-04-20 18:50:00,9611,6997,7036,12697,14978,14052,6002,3200,2781,26663,80,25.05,54,45.042025,38.932340,12\n2026-04-20 18:50:15,9955,6670,6989,13046,15044,14041,6086,3320,2760,26604,80,24.96,57,45.041963,38.932808,11\n2026-04-20 18:50:30,9551,6911,7017,13312,15242,14285,6320,3321,2780,26635,84,25.04,54,45.041420,38.933189,12\n2026-04-20 18:50:45,9889,6747,6812,13239,15109,14445,6149,3259,2842,26663,76,24.82,57,45.042485,38.935070,12\n2026-04-20 18:51:00,9819,7070,7068,13383,15165,14214,6191,3337,2817,26663,78,24.77,55,45.041309,38.935735,11\n2026-04-20 18:51:15,10144,6908,7125,13168,15118,14530,6290,3369,2912,26663,77,24.92,55,45.041945,38.937518,10\n2026-04-20 18:51:30,9952,7070,6963,13069,15366,14209,6407,3399,2855,26641,87,24.80,54,45.042536,38.938837,10\n2026-04-20 18:51:45,9875,7014,6834,13250,15308,14293,6161,3381,2884,26633,74,24.83,57,45.043629,38.938927,12\n2026-04-20 18:52:00,10194,7113,7061,12934,14990,14423,6452,3296,2973,26663,86,24.94,53,45.043882,38.940729,11\n2026-04-20 18:52:15,10090,6880,7117,12855,15143,14407,6436,3413,2971,26663,87,24.92,53,45.043585,38.942399,11\n2026-04-20 18:52:30,9997,7114,6947,13462,15166,14629,6374,3378,2965,26656,87,24.84,54,45.042772,38.943255,10\n2026-04-20 18:52:45,9942,7090,7074,13348,15269,14419,6273,3479,3010,26663,86,24.87,56,45.044134,38.944795,12\n2026-04-20 18:53:00,10243,6976,6968,13030,15499,14628,6461,3414,2935,26663,83,24.81,56,45.044234,38.944429,10\n2026-04-20 18:53:15,10256,7190,6957,13254,15095,14988,6183,3357,3034,26663,80,24.89,55,45.044451,38.946555,11\n2026-04-20 18:53:30,9930,6981,6939,13278,15022,14812,6349,3381,3087,22824,71,24.67,54,45.044524,38.947546,11\n2026-04-20 18:53:45,10122,7133,7032,13351,15234,14967,6334,3488,3103,26663,87,24.64,54,45.044501,38.948923,12\n2026-04-20 18:54:00,10474,7057,6950,12972,15545,14762,6522,3456,3061,26640,86,24.40,55,45.044774,38.950282,12\n2026-04-20 18:54:15,10250,7221,7029,13477,15133,15047,6486,3382,3071,26624,82,24.55,56,45.044940,38.950257,11\n2026-04-20 18:54:30,10094,7169,7158,13152,15501,15073,6501,3445,3071,22732,80,24.54,54,45.045515,38.952566,10\n2026-04-20 18:54:45,10210,7180,7173,13547,15730,14709,6298,3422,3137,26635,85,24.69,54,45.045680,38.953561,10\n2026-04-20 18:55:00,10408,7383,7122,13309,15146,15178,6491,3425,3144,22756,87,24.29,54,45.045435,38.955297,12\n2026-04-20 18:55:15,10039,7190,7216,13305,15461,15201,6328,3428,3100,26645,78,24.62,55,45.046204,38.955642,11\n2026-04-20 18:55:30,10557,7405,7216,13530,15294,15061,6623,3459,3189,26663,103,24.19,55,45.045260,38.957014,11\n2026-04-20 18:55:45,10106,7112,7231,13529,15318,15221,6588,3491,3195,26663,78,24.38,55,45.046227,38.957875,12\n2026-04-20 18:56:00,10387,7274,7157,13140,15549,14800,6591,3515,3213,22786,78,24.44,57,45.044851,38.959955,10\n2026-04-20 18:56:15,10140,7202,7214,13616,15423,14942,6406,3393,3233,26663,88,24.16,59,45.045712,38.962248,12\n2026-04-20 18:56:30,10337,7356,7234,13384,15313,14780,6576,3523,3233,22736,85,24.47,54,45.045056,38.962843,11\n2026-04-20 18:56:45,10288,7442,7308,13465,15218,14828,6528,3390,3231,22771,87,24.39,54,45.045278,38.964834,12\n2026-04-20 18:57:00,10634,7460,7065,13147,15494,14857,6418,3496,3281,26637,78,24.42,58,45.046536,38.966245,11\n2026-04-20 18:57:15,10248,7176,7164,13279,15500,15034,6628,3418,3303,22798,80,23.99,57,45.045193,38.967007,11\n2026-04-20 18:57:30,10575,7406,7153,13406,15253,14783,6537,3380,3318,22829,91,23.94,56,45.046410,38.968800,9\n2026-04-20 18:57:45,10662,7472,7176,13315,15153,15143,6594,3383,3294,26610,83,23.94,57,45.046449,38.969502,11\n2026-04-20 18:58:00,10341,7379,7138,13544,15660,15158,6775,3387,3311,22791,89,24.05,57,45.045471,38.971512,11\n2026-04-20 18:58:15,10360,7445,7250,13380,15558,15055,6569,3411,3318,22742,76,24.11,56,45.046373,38.972521,12\n2026-04-20 18:58:30,10544,7206,7265,13277,15552,15328,6675,3390,3387,22854,85,24.08,58,45.046287,38.973219,12\n2026-04-20 18:58:45,10443,7347,7263,13242,15637,14951,6752,3486,3368,22837,85,23.79,55,45.046221,38.974821,10\n2026-04-20 18:59:00,10511,7450,7150,13056,15651,15031,6614,3379,3396,22774,88,23.73,56,45.045944,38.975386,11\n2026-04-20 18:59:15,10646,7289,7340,13606,15679,15254,6581,3443,3393,22747,78,23.70,58,45.045969,38.976748,10\n2026-04-20 18:59:30,10475,7347,7316,13222,15383,14859,6810,3385,3370,26663,79,23.70,55,45.045559,38.978372,10\n2026-04-20 18:59:45,10727,7350,7104,13032,15266,14838,6606,3469,3392,22770,85,23.96,56,45.046220,38.981115,10\n2026-04-20 19:00:00,10449,7591,7313,13091,15508,15281,6684,3411,3481,22835,73,23.75,56,45.045043,38.982521,11\n2026-04-20 19:00:15,10749,7308,7080,13228,15493,14843,6707,3379,3362,22800,111,23.80,56,45.046648,38.982923,11\n2026-04-20 19:00:30,10731,7440,7079,13529,15559,15213,6856,3458,3364,22815,78,23.77,55,45.046884,38.982836,11\n2026-04-20 19:00:45,10555,7248,6906,13371,15181,14910,6511,3458,3440,22832,84,23.63,58,45.048038,38.981293,11\n2026-04-20 19:01:00,10280,7538,7220,13446,15394,15174,6521,3337,3352,22837,97,23.82,57,45.047571,38.980710,10\n2026-04-20 19:01:15,10626,7251,7102,13365,15063,15016,6634,3338,3414,22837,86,23.41,57,45.048242,38.978803,9\n2026-04-20 19:01:30,10315,7541,7078,12887,15587,15118,6612,3431,3298,22818,80,23.69,56,45.048971,38.977596,12\n2026-04-20 19:01:45,10195,7395,6930,13259,15491,15059,6728,3374,3361,22785,101,23.42,57,45.049191,38.976951,10\n2026-04-20 19:02:00,10577,7410,7195,13373,15350,15048,6740,3409,3261,22873,76,23.36,58,45.049237,38.974361,10\n2026-04-20 19:02:15,10094,7193,7067,12813,15534,15041,6574,3482,3286,22864,90,23.60,58,45.050643,38.973897,12\n2026-04-20 19:02:30,10460,7160,6845,12795,15178,14936,6516,3381,3282,22870,106,23.53,56,45.050800,38.972606,11\n2026-04-20 19:02:45,10009,7257,6848,12858,15225,14973,6604,3463,3271,22810,74,23.13,59,45.052045,38.972387,10\n2026-04-20 19:03:00,10047,7398,6754,12742,15408,15063,6305,3330,3267,22855,83,23.26,59,45.051990,38.970179,10\n2026-04-20 19:03:15,10238,7129,6912,13159,15358,14823,6560,3368,3287,22855,89,23.25,57,45.051650,38.969778,11\n2026-04-20 19:03:30,9951,7251,6743,12781,15055,15276,6285,3470,3180,22809,94,23.41,59,45.052361,38.968549,10\n2026-04-20 19:03:45,10086,7207,6880,12819,15286,15040,6498,3379,3162,22741,95,23.10,59,45.052942,38.966314,9\n2026-04-20 19:04:00,10174,7335,6848,13157,14994,15074,6424,3470,3162,22864,84,23.08,58,45.053309,38.965096,10\n2026-04-20 19:04:15,10274,7231,6744,12780,14752,14954,6507,3389,3117,22740,94,23.06,60,45.054423,38.964918,12\n2026-04-20 19:04:30,10155,7382,6760,12887,14995,15062,6234,3448,3143,22819,123,23.13,57,45.054003,38.963330,11\n2026-04-20 19:04:45,9869,7156,6743,12665,15080,14754,6479,3315,3099,22732,103,22.95,58,45.054971,38.961216,11\n2026-04-20 19:05:00,9998,7356,6593,12737,15042,15080,6194,3421,3058,22760,76,22.93,58,45.054535,38.959673,10\n2026-04-20 19:05:15,9916,7050,6567,12450,14845,14833,6194,3329,3035,22777,108,22.81,60,45.054906,38.959458,10\n2026-04-20 19:05:30,9838,7236,6709,12421,15003,14598,6387,3355,3089,22786,94,22.94,57,45.055677,38.958080,9\n2026-04-20 19:05:45,9637,7264,6672,12604,14520,14615,6325,3373,3006,22801,89,22.60,59,45.056268,38.956412,10\n2026-04-20 19:06:00,9832,7139,6441,12322,14732,14570,6288,3315,2936,22849,103,22.91,60,45.056471,38.954800,12\n2026-04-20 19:06:15,9880,7174,6414,12613,14545,14492,6071,3315,2956,22803,117,22.76,58,45.056413,38.954815,12\n2026-04-20 19:06:30,9467,7066,6609,12516,14480,14518,6129,3293,2902,22852,90,22.83,61,45.057909,38.953195,10\n2026-04-20 19:06:45,9806,7138,6521,12339,14873,14566,5972,3308,2887,22774,108,22.75,60,45.057260,38.951332,11\n2026-04-20 19:07:00,9418,7076,6324,12177,14547,14575,6023,3256,2890,22761,110,22.43,58,45.058352,38.949960,12\n2026-04-20 19:07:15,9317,7033,6536,12340,14905,14156,5912,3265,2835,22777,87,22.64,61,45.058887,38.950059,9\n2026-04-20 19:07:30,9483,7055,6138,12032,14591,14476,6040,3222,2823,22790,78,22.46,58,45.059592,38.947860,11\n2026-04-20 19:07:45,9157,6844,6503,12343,14409,14034,5944,3209,2835,22744,75,22.43,60,45.059000,38.947471,12\n2026-04-20 19:08:00,9530,6735,6320,12458,14517,14526,6085,3232,2803,22738,76,22.30,61,45.060205,38.946893,10\n2026-04-20 19:08:15,9218,6658,6051,12345,14341,14172,5836,3062,2771,22803,95,22.38,59,45.060569,38.944652,10\n2026-04-20 19:08:30,9062,6675,6164,11901,14298,14066,5981,3109,2735,22729,91,22.22,62,45.060816,38.943062,11\n2026-04-20 19:08:45,9303,6757,6305,12135,14363,13824,6017,3191,2762,18934,76,22.26,60,45.060799,38.943274,12\n2026-04-20 19:09:00,9135,6597,5919,11646,14093,13809,5728,3054,2641,22829,87,22.35,61,45.062045,38.941397,10\n2026-04-20 19:09:15,9002,6569,5981,11861,14064,13982,5942,3006,2650,22787,102,22.33,61,45.062249,38.939874,10\n2026-04-20 19:09:30,8835,6621,5937,12176,14462,13930,5677,3085,2712,19046,144,21.93,62,45.062528,38.940408,12\n2026-04-20 19:09:45,9100,6594,5777,11912,14060,14020,5776,3097,2605,18929,85,21.99,63,45.063709,38.939225,11\n2026-04-20 19:10:00,8993,6589,5915,11711,13983,13651,5957,3059,2566,22846,146,21.90,61,45.063188,38.937806,11\n2026-04-20 19:10:15,8951,6420,5963,11407,13954,13505,5831,3001,2581,22781,101,21.90,61,45.064247,38.937020,10\n2026-04-20 19:10:30,8424,6690,5961,11782,13719,13745,5882,2965,2525,18963,85,21.92,59,45.064677,38.934835,12\n2026-04-20 19:10:45,8528,6418,5801,11720,13999,13688,5762,2869,2509,18997,148,22.06,63,45.065108,38.933952,12\n2026-04-20 19:11:00,8576,6494,5762,11283,13915,13581,5619,2904,2421,22779,152,21.69,62,45.066600,38.932409,12\n2026-04-20 19:11:15,8667,6627,5591,11715,13666,13499,5565,2965,2446,19007,97,21.61,60,45.065978,38.932365,11\n2026-04-20 19:11:30,8409,6299,5679,11406,14025,13061,5468,2929,2423,22754,110,21.89,60,45.066114,38.931924,11\n2026-04-20 19:11:45,8400,6377,5549,11059,13968,13240,5622,2850,2384,22851,130,21.65,59,45.067342,38.930527,12\n2026-04-20 19:12:00,8541,6534,5689,11169,13525,13219,5476,2784,2424,18973,94,21.43,61,45.066968,38.929138,13\n2026-04-20 19:12:15,8383,6158,5339,11071,13772,13018,5462,2762,2416,18971,138,21.76,61,45.068088,38.928088,12\n2026-04-20 19:12:30,8039,6367,5339,11437,13601,13041,5378,2830,2411,22862,158,21.47,59,45.067880,38.926457,12\n2026-04-20 19:12:45,8289,6228,5301,11173,13796,12853,5464,2694,2314,18987,90,21.58,60,45.069249,38.926099,10\n2026-04-20 19:13:00,8272,6174,5432,10691,13163,12876,5604,2676,2301,22808,136,21.34,62,45.070023,38.924192,12\n2026-04-20 19:13:15,8293,6324,5161,11040,13200,12525,5495,2780,2331,22760,102,21.50,60,45.068948,38.922681,10\n2026-04-20 19:13:30,7776,6029,5174,11066,13192,12561,5341,2657,2314,18972,82,21.39,61,45.070035,38.922851,10\n2026-04-20 19:13:45,7940,5981,5265,10942,13645,12379,5477,2753,2199,22856,104,21.16,61,45.070087,38.921313,10\n2026-04-20 19:14:00,8097,5966,5081,10979,13685,12344,5234,2600,2282,19044,124,21.03,61,45.070971,38.921008,11\n2026-04-20 19:14:15,7855,5981,5063,10615,13392,12297,5548,2686,2187,19017,155,20.99,62,45.070269,38.919229,10\n2026-04-20 19:14:30,7629,6152,4991,10785,13188,12574,5310,2599,2129,18954,96,21.07,62,45.071857,38.918754,12\n2026-04-20 19:14:45,7815,6165,5115,10510,13370,12128,5198,2630,2189,22781,124,21.11,62,45.071086,38.916892,12\n2026-04-21 11:30:00,8405,6147,5568,10907,13516,9160,6150,1747,2904,11425,348,22.62,50,44.990395,39.053513,11\n2026-04-21 11:30:15,8177,6170,5408,11461,14042,9237,6466,1713,2913,11408,373,22.64,47,44.989287,39.052491,12\n2026-04-21 11:30:30,8074,5901,5345,11126,13566,9238,6455,1764,2926,11398,395,22.75,49,44.988391,39.050581,11\n2026-04-21 11:30:45,8476,6027,5469,11243,14172,9106,6274,1808,2931,11345,360,22.65,47,44.988351,39.050043,12\n2026-04-21 11:31:00,8302,5969,5516,11092,13635,9343,6241,1843,2866,11438,386,22.68,46,44.986985,39.048473,13\n2026-04-21 11:31:15,8216,6030,5502,11615,13658,9047,6283,1767,2942,11424,393,22.87,46,44.987389,39.046630,11\n2026-04-21 11:31:30,8202,5947,5398,11188,14018,9450,6320,1773,2878,11428,403,22.84,46,44.987003,39.045919,12\n2026-04-21 11:31:45,8461,6070,5468,11494,13711,9326,6342,1867,2867,11420,389,22.89,47,44.986106,39.044656,11\n2026-04-21 11:32:00,8367,6011,5397,11469,13578,9067,6290,1739,2834,11439,366,22.78,47,44.984442,39.043425,12\n2026-04-21 11:32:15,8329,5933,5438,11158,13960,9241,6143,1771,2852,11357,399,22.93,47,44.983781,39.042559,12\n2026-04-21 11:32:30,8314,6053,5417,11192,14238,8929,6374,1709,2831,11357,372,22.91,49,44.983073,39.040361,10\n2026-04-21 11:32:45,8197,6152,5553,11550,13700,9321,6300,1750,2838,11383,345,23.07,47,44.982462,39.039927,11\n2026-04-21 11:33:00,8186,5921,5615,11334,13701,8947,6439,1778,2878,11427,396,23.04,46,44.982547,39.038427,11\n2026-04-21 11:33:15,8199,5982,5437,11290,14076,8885,6451,1731,2865,11475,375,23.24,49,44.980796,39.037374,11\n2026-04-21 11:33:30,8326,5999,5613,11461,13889,9150,6407,1786,2837,11466,344,23.27,46,44.981387,39.036535,13\n2026-04-21 11:33:45,8456,5922,5640,10991,14107,8843,6216,1720,2763,7562,385,23.01,48,44.979224,39.035644,11\n2026-04-21 11:34:00,8155,6027,5669,11460,14131,8859,6196,1677,2757,11341,356,23.29,48,44.978908,39.033337,13\n2026-04-21 11:34:15,8056,6119,5419,11509,14032,8814,6205,1691,2745,11417,342,23.44,45,44.978323,39.033143,13\n2026-04-21 11:34:30,8242,5861,5653,11565,14039,8937,6176,1670,2751,11433,373,23.14,46,44.976905,39.031062,13\n2026-04-21 11:34:45,8250,6072,5476,11119,13729,8847,6109,1746,2789,11365,387,23.43,46,44.977086,39.031142,12\n2026-04-21 11:35:00,8364,6014,5416,11238,13881,8839,6175,1779,2743,11405,345,23.41,46,44.975814,39.029066,12\n2026-04-21 11:35:15,8185,5822,5588,11066,13605,8626,6213,1740,2746,7586,373,23.43,49,44.975059,39.027641,12\n2026-04-21 11:35:30,8216,5799,5690,11094,13675,8713,6329,1738,2791,11326,406,23.48,47,44.975198,39.026672,11\n2026-04-21 11:35:45,7984,5911,5535,11084,13724,8692,6282,1745,2764,7548,348,23.33,48,44.974468,39.025448,13\n2026-04-21 11:36:00,8102,5780,5521,11052,13962,8632,6249,1759,2756,11439,346,23.38,45,44.974083,39.024648,11\n2026-04-21 11:36:15,8152,5744,5479,11325,13574,8845,6232,1625,2648,11462,346,23.56,47,44.972313,39.022963,11\n2026-04-21 11:36:30,8145,5929,5575,11168,13660,8545,6301,1729,2630,7605,351,23.70,48,44.971993,39.022855,13\n2026-04-21 11:36:45,8138,5989,5511,11482,13517,8491,6114,1624,2709,11367,367,23.67,47,44.972192,39.021891,12\n2026-04-21 11:37:00,8142,5655,5408,11315,13653,8545,6156,1697,2680,7578,340,23.63,46,44.970286,39.019705,11\n2026-04-21 11:37:15,7895,5845,5539,10991,14062,8697,6112,1628,2641,7666,364,23.97,46,44.970549,39.019391,11\n2026-04-21 11:37:30,8071,5746,5547,11235,13810,8427,6201,1698,2652,11330,397,23.63,47,44.968911,39.017681,11\n2026-04-21 11:37:45,8077,5670,5529,11272,13464,8560,6056,1709,2663,11358,397,23.91,46,44.969270,39.017944,13\n2026-04-21 11:38:00,7862,5665,5299,10994,14090,8544,6144,1612,2554,7546,353,23.90,47,44.968855,39.016579,13\n2026-04-21 11:38:15,7565,5493,5235,10771,13977,8630,5911,1641,2517,11340,367,23.91,46,44.966862,39.015628,11\n2026-04-21 11:38:30,8013,5783,5160,10905,13303,8155,5866,1636,2592,11333,370,23.87,45,44.966362,39.015027,12\n2026-04-21 11:38:45,8041,5743,5399,11307,13868,8318,5865,1631,2515,11461,334,23.96,48,44.966180,39.012974,13\n2026-04-21 11:39:00,7784,5810,5343,11018,13839,8456,6051,1556,2544,11446,389,24.04,47,44.966433,39.012505,11\n2026-04-21 11:39:15,7479,5589,5287,11046,13766,8323,6141,1626,2488,7528,366,24.28,46,44.964892,39.011571,11\n2026-04-21 11:39:30,7585,5625,5223,11200,13434,8013,5954,1606,2546,7645,385,24.25,43,44.964772,39.010339,11\n2026-04-21 11:39:45,7830,5750,5339,10685,13862,8155,6152,1595,2530,7570,374,24.30,45,44.964180,39.008910,12\n2026-04-21 11:40:00,7394,5675,5326,10877,13462,8094,5748,1600,2391,11407,353,24.25,48,44.962594,39.006788,11\n2026-04-21 11:40:15,7775,5561,5246,10692,13469,8145,6055,1512,2435,7530,369,24.34,44,44.962700,39.005919,11\n2026-04-21 11:40:30,7395,5395,5329,11182,13659,7909,5886,1619,2458,7537,377,24.23,48,44.962647,39.004832,12\n2026-04-21 11:40:45,7256,5365,5284,10752,13486,8063,5953,1520,2413,7623,320,24.47,44,44.960623,39.003835,12\n2026-04-21 11:41:00,7353,5592,5052,10597,13681,7964,6001,1588,2425,7636,325,24.21,45,44.960828,39.001873,12\n2026-04-21 11:41:15,7481,5463,5090,10610,13632,8171,5832,1440,2398,7597,387,24.28,46,44.959637,39.002066,11\n2026-04-21 11:41:30,7474,5296,4960,11051,13378,8164,5921,1467,2361,7568,355,24.51,45,44.959662,39.000131,12\n2026-04-21 11:41:45,7249,5296,4872,10860,13446,7888,5859,1531,2270,7571,337,24.62,46,44.958336,38.999613,11\n2026-04-21 11:42:00,7552,5340,5095,10508,13143,7691,5665,1433,2331,11438,347,24.66,43,44.958152,38.998276,13\n2026-04-21 11:42:15,7296,5508,5048,10474,13093,7675,5802,1454,2291,7605,318,24.64,44,44.955914,38.997303,12\n2026-04-21 11:42:30,7179,5413,5000,10501,12978,7830,5791,1522,2211,7589,340,24.43,45,44.956573,38.994464,12\n2026-04-21 11:42:45,7118,5277,4999,10198,13066,7893,5609,1480,2228,7540,348,24.81,46,44.954578,38.994755,11\n2026-04-21 11:43:00,6989,5220,4733,10191,13041,7862,5518,1374,2201,7638,307,24.80,44,44.954498,38.992993,11\n2026-04-21 11:43:15,7021,5132,4675,10098,12777,7690,5783,1470,2187,7619,336,24.57,46,44.953094,38.991822,12\n2026-04-21 11:43:30,7117,5111,4806,10063,12735,7902,5700,1463,2142,7563,356,24.89,44,44.951930,38.990009,12\n2026-04-21 11:43:45,7157,5060,4775,10426,12740,7490,5714,1334,2077,7567,313,24.95,44,44.952229,38.989385,13\n2026-04-21 11:44:00,6774,5047,4605,9954,12880,7836,5578,1448,2050,7613,362,24.85,46,44.950690,38.987142,11\n2026-04-21 11:44:15,6889,5023,4666,10115,12944,7581,5507,1385,2035,7587,317,24.79,46,44.950555,38.986770,11\n2026-04-21 11:44:30,6648,5212,4658,10025,12604,7258,5378,1385,2079,7589,320,25.01,42,44.948709,38.984498,12\n2026-04-21 11:44:45,6740,4997,4584,10297,12965,7591,5276,1354,1973,7675,352,25.06,44,44.948916,38.983121,13\n2026-04-21 11:45:00,6690,5013,4435,9918,12989,7679,5300,1284,2042,7640,355,24.84,43,44.948878,38.981470,11\n2026-04-21 11:45:15,6525,5196,4669,10106,12743,7292,5323,1302,2046,7571,308,25.01,47,44.948086,38.980359,13\n2026-04-21 11:45:30,6567,5234,4677,9956,12874,7535,5623,1319,2028,7641,345,25.07,43,44.949447,38.978716,11\n2026-04-21 11:45:45,6808,5279,4741,10325,13152,7737,5310,1405,2044,7588,338,25.18,44,44.949483,38.975957,12\n2026-04-21 11:46:00,6904,5039,4522,10334,12798,7729,5384,1366,2026,7592,339,24.99,43,44.949417,38.974921,12\n2026-04-21 11:46:15,6989,5089,4625,10385,13157,7664,5267,1280,1996,7610,335,25.23,45,44.949477,38.971887,13\n2026-04-21 11:46:30,6738,4959,4718,10395,12953,7465,5409,1351,2029,7607,338,25.32,46,44.950330,38.971821,11\n2026-04-21 11:46:45,7034,5055,4770,10167,12938,7277,5596,1415,1992,7569,321,25.26,44,44.950800,38.969523,12\n2026-04-21 11:47:00,6973,5006,4674,10130,13069,7287,5341,1406,1980,7609,296,25.41,44,44.951859,38.966851,11\n2026-04-21 11:47:15,6788,5007,4821,10523,12784,7707,5288,1372,1983,7671,353,25.36,45,44.952126,38.966400,12\n2026-04-21 11:47:30,6923,4998,4779,10020,12724,7473,5576,1444,2006,7648,309,25.17,44,44.952440,38.963893,12\n2026-04-21 11:47:45,6999,5268,4954,10313,12796,7529,5303,1486,2037,7553,298,25.18,44,44.953516,38.962964,12\n2026-04-21 11:48:00,7006,4959,4680,10462,13351,7732,5634,1345,2033,7661,312,25.23,43,44.953646,38.961299,13\n2026-04-21 11:48:15,6930,5191,4896,10221,12774,7334,5636,1450,2001,7528,317,25.28,46,44.954087,38.959460,13\n2026-04-21 11:48:30,6742,5134,4664,10291,13071,7342,5423,1372,1994,7661,315,25.54,44,44.954387,38.956962,12\n2026-04-21 11:48:45,6761,5150,4916,10705,13442,7809,5363,1387,2030,7557,343,25.53,43,44.955258,38.956068,12\n2026-04-21 11:49:00,7140,5046,5060,10629,13487,7482,5523,1408,2001,3781,304,25.52,46,44.955881,38.954959,12\n2026-04-21 11:49:15,6938,5107,4760,10539,13039,7479,5551,1445,1981,7636,305,25.45,46,44.955455,38.952601,11\n2026-04-21 11:49:30,6893,5086,4877,10382,13045,7736,5285,1413,1956,3849,316,25.83,42,44.956088,38.951138,11\n2026-04-21 11:49:45,7050,4997,4771,10370,13115,7439,5586,1399,1922,7577,276,25.49,43,44.956994,38.950310,12\n2026-04-21 11:50:00,6805,4998,4843,10881,13420,7854,5357,1470,1984,7560,315,25.73,42,44.958650,38.948421,11\n2026-04-21 11:50:15,6804,4960,4855,10846,13109,7621,5528,1424,1987,7525,304,25.64,42,44.958742,38.947313,12\n2026-04-21 11:50:30,7257,5230,4894,10637,13369,7716,5366,1467,2028,7657,269,25.98,43,44.959472,38.945592,12\n2026-04-21 11:50:45,7122,5240,5066,10473,13144,7532,5479,1394,1933,3773,299,25.91,43,44.959366,38.942666,12\n2026-04-21 11:51:00,6803,5082,4876,10337,13361,7834,5578,1513,1990,7590,328,25.81,44,44.959736,38.941696,12\n2026-04-21 11:51:15,6745,5049,4901,10454,12948,7641,5447,1494,1884,7593,308,26.00,45,44.960348,38.939644,12\n2026-04-21 11:51:30,6825,5024,4981,10374,13386,7532,5381,1419,1986,7560,329,26.04,45,44.961117,38.939187,13\n2026-04-21 11:51:45,7097,5221,5100,10607,13227,7794,5439,1439,1932,3729,300,25.87,45,44.961603,38.937318,11\n2026-04-21 11:52:00,6950,5150,5206,10802,13393,7759,5592,1543,1925,3726,289,25.84,45,44.963301,38.935149,11\n2026-04-21 11:52:15,6831,5250,5304,11030,13136,7867,5453,1524,1922,7673,283,25.97,43,44.964288,38.934607,13\n2026-04-21 11:52:30,6972,5136,5068,10527,13652,7898,5400,1454,1919,3818,281,26.18,43,44.964661,38.932678,11\n2026-04-21 11:52:45,6886,4907,5050,10474,13527,8029,5373,1457,1952,3811,283,26.27,45,44.964636,38.931084,11\n2026-04-21 11:53:00,6805,5023,5154,10859,13334,7524,5566,1534,1954,3805,286,26.36,41,44.965701,38.930084,11\n2026-04-21 11:53:15,6970,5222,5175,10938,13388,7704,5417,1540,1879,3838,271,26.16,42,44.965678,38.928553,11\n2026-04-21 11:53:30,7193,5040,5043,11053,13633,8062,5530,1523,1963,7534,324,26.26,44,44.967088,38.926713,11\n2026-04-21 11:53:45,7137,5087,5019,10841,13014,7670,5315,1490,1914,3843,284,26.41,45,44.966933,38.924408,13\n2026-04-21 11:54:00,6789,5038,5082,10465,13571,7599,5527,1557,1894,3821,317,26.33,43,44.967643,38.923204,13\n2026-04-21 11:54:15,6985,5059,5137,10938,13340,7562,5370,1514,1857,3842,304,26.49,45,44.967930,38.920938,12\n2026-04-21 11:54:30,6869,5074,4930,10915,13053,7750,5401,1448,1827,3823,307,26.29,43,44.968044,38.919472,13\n2026-04-21 11:54:45,6723,4960,5270,10844,13686,7593,5541,1604,1917,7584,283,26.41,45,44.969433,38.919511,12\n2026-04-21 11:55:00,6899,5001,5072,10897,13361,7919,5273,1486,1836,3814,255,26.64,43,44.970018,38.917985,12\n2026-04-21 11:55:15,6960,5079,5023,10425,13432,7960,5153,1438,1863,3742,243,26.40,42,44.969690,38.915169,11\n2026-04-21 11:55:30,6942,4827,5032,10407,13156,7769,5271,1494,1829,7596,244,26.63,44,44.971050,38.913540,12\n2026-04-21 11:55:45,6731,5061,5162,10407,13404,7764,5360,1453,1830,7627,260,26.41,43,44.971547,38.911445,11\n2026-04-21 11:56:00,6665,5102,4873,10353,13155,7619,5366,1496,1802,3866,286,26.75,44,44.971451,38.910724,11\n2026-04-21 11:56:15,6666,5008,4940,10816,13045,7964,5256,1505,1820,3810,259,26.47,44,44.972354,38.908520,13\n2026-04-21 11:56:30,6670,4770,5022,10787,12960,7633,5146,1472,1741,3790,278,26.63,44,44.971659,38.907045,11\n2026-04-21 11:56:45,6472,5036,4815,10271,12869,7603,5079,1535,1694,3836,278,26.86,44,44.972974,38.904707,13\n2026-04-21 11:57:00,6812,4768,4766,10729,13266,7827,5373,1481,1738,3757,267,26.50,45,44.974149,38.903094,13\n2026-04-21 11:57:15,6807,4788,4770,10185,13116,7621,5207,1407,1668,7667,270,26.57,41,44.973737,38.901826,11\n2026-04-21 11:57:30,6879,4969,4803,10539,13216,7474,5026,1427,1694,3775,293,26.67,43,44.975238,38.899791,11\n2026-04-21 11:57:45,6878,4850,4775,10511,13267,7758,5063,1543,1732,3771,236,26.90,42,44.974795,38.899710,13\n2026-04-21 11:58:00,6383,4701,4923,10164,13020,7449,5083,1376,1695,3831,281,26.80,41,44.975068,38.897047,11\n2026-04-21 11:58:15,6821,4939,4888,10480,12741,7676,5067,1529,1722,3871,282,27.07,43,44.975770,38.896346,12\n2026-04-21 11:58:30,6459,4954,4703,10310,12982,7296,4960,1511,1657,3857,230,26.86,44,44.977124,38.893253,12\n2026-04-21 11:58:45,6770,4879,4917,10497,13269,7855,5083,1485,1707,3745,233,26.89,44,44.978211,38.893295,11\n2026-04-21 11:59:00,6600,4951,4670,10334,13224,7639,4999,1375,1666,3765,251,27.05,41,44.978521,38.891274,13\n2026-04-21 11:59:15,6620,4737,4529,10019,12585,7361,4924,1379,1593,3820,238,27.03,43,44.978380,38.889280,13\n2026-04-21 11:59:30,6655,4855,4521,10052,12974,7591,4977,1485,1606,3843,225,26.94,41,44.978974,38.888300,11\n2026-04-21 11:59:45,6409,4808,4595,10225,13011,7408,4909,1395,1624,3861,240,26.86,42,44.979295,38.885595,13\n2026-04-21 12:00:00,6276,4877,4747,10232,12935,7629,4945,1454,1550,3763,245,27.24,43,44.981014,38.884979,12\n2026-04-21 12:00:15,6384,4838,4476,10252,12687,7551,4894,1449,1553,3748,264,27.23,43,44.980858,38.883341,13\n2026-04-21 12:00:30,6237,4763,4445,9861,13090,7413,4852,1405,1538,3872,211,27.28,42,44.982579,38.881964,12\n2026-04-21 12:00:45,6284,4724,4593,10146,13025,7596,4890,1424,1552,3841,223,27.37,41,44.983460,38.883069,11\n2026-04-21 12:01:00,6321,4987,4757,10394,12732,7825,4953,1381,1615,3788,253,27.18,40,44.985261,38.884524,12\n2026-04-21 12:01:15,6479,4953,4817,10215,12658,7358,5054,1501,1675,3812,264,27.14,40,44.985778,38.884779,13\n2026-04-21 12:01:30,6510,4789,4773,10524,13201,7607,4950,1536,1602,3844,216,27.43,40,44.987295,38.883992,13\n2026-04-21 12:01:45,6384,4758,5030,10605,13344,7536,5203,1429,1623,3783,262,27.08,43,44.987774,38.885860,13\n2026-04-21 12:02:00,6590,4960,4844,10370,12841,7666,5279,1433,1693,3874,216,27.29,44,44.988894,38.885850,11\n2026-04-21 12:02:15,6405,4983,4842,10527,12787,7557,5072,1452,1645,3847,254,27.47,43,44.989399,38.885882,13\n2026-04-21 12:02:30,6846,5004,5187,10820,13389,8123,5226,1510,1765,3772,224,27.19,42,44.991930,38.887151,11\n2026-04-21 12:02:45,6603,5048,5164,10738,13248,8136,5093,1634,1741,3807,248,27.58,39,44.992525,38.887325,11\n2026-04-21 12:03:00,6995,4790,4939,10483,13238,8116,5329,1580,1696,3833,201,27.49,42,44.992806,38.887141,11\n2026-04-21 12:03:15,7058,4917,5149,10466,12977,8004,5230,1570,1748,3773,219,27.69,43,44.993540,38.888159,11\n2026-04-21 12:03:30,7106,4894,5276,10841,13326,8106,5322,1596,1742,31,236,27.45,41,44.995847,38.888716,12\n2026-04-21 12:03:45,7088,5190,5337,11001,13675,8312,5155,1670,1744,3783,216,27.61,40,44.995408,38.889376,11\n2026-04-21 12:04:00,7057,4965,5182,11124,13146,7999,5407,1673,1824,3726,195,27.64,42,44.996814,38.889622,11\n2026-04-21 12:04:15,7093,5011,5280,11155,13146,7930,5301,1686,1828,3771,228,27.80,42,44.998006,38.889778,11\n2026-04-21 12:04:30,6973,5129,5307,11164,13233,8403,5329,1650,1829,3822,187,27.83,41,44.999711,38.889746,12\n2026-04-21 12:04:45,6919,5149,5410,10843,13338,8026,5458,1595,1785,3744,222,27.48,41,44.999790,38.890733,11\n2026-04-21 12:05:00,7060,5187,5512,11067,13458,8164,5446,1686,1881,3747,209,27.73,43,45.000893,38.891344,12\n2026-04-21 12:05:15,7327,5069,5493,10998,13785,8379,5408,1644,1852,3805,218,27.60,41,45.001559,38.891855,12\n2026-04-21 12:05:30,7385,5319,5402,11537,13481,8339,5340,1699,1849,3850,183,27.95,39,45.002822,38.892602,10\n2026-04-21 12:05:45,6945,5290,5414,11295,13877,8646,5316,1768,1862,3781,246,27.70,41,45.003560,38.891671,12\n2026-04-21 12:06:00,7142,5045,5570,11402,13473,8648,5308,1677,1853,3812,193,27.95,42,45.003788,38.892690,11\n2026-04-21 12:06:15,7364,5209,5478,11406,13845,8544,5343,1809,1867,24,219,27.65,40,45.005569,38.892466,11\n2026-04-21 12:06:30,7353,5366,5593,11618,13639,8647,5589,1794,1962,0,207,27.74,40,45.005444,38.894274,13\n2026-04-21 12:06:45,7072,5321,5614,11414,14014,8485,5431,1756,1960,3729,193,27.73,42,45.006913,38.893618,13\n2026-04-21 12:07:00,7396,5398,5710,11162,13947,8665,5637,1808,1917,0,203,28.11,40,45.008247,38.893834,13\n2026-04-21 12:07:15,7159,5168,5592,11620,13758,8735,5638,1752,1957,0,207,28.18,42,45.008714,38.894696,12\n2026-04-21 12:07:30,7204,5256,5692,11539,13707,8728,5375,1794,1951,3726,216,27.99,41,45.009584,38.894694,12\n2026-04-21 12:07:45,7228,5413,5905,11419,13638,8835,5651,1819,1924,3826,199,28.22,43,45.009554,38.895499,12\n2026-04-21 12:08:00,7496,5330,5763,11510,13926,8451,5352,1870,1979,44,205,28.15,43,45.009957,38.895676,12\n2026-04-21 12:08:15,7413,5389,5928,11857,14253,8847,5570,1832,1979,3828,210,28.30,39,45.010797,38.896083,11\n2026-04-21 12:08:30,7433,5405,5701,11700,13749,9046,5680,1897,2047,17,192,28.00,40,45.011649,38.897011,11\n2026-04-21 12:08:45,7534,5169,5690,11532,13930,8946,5524,1811,2001,3821,202,28.04,41,45.013742,38.896431,12\n2026-04-21 12:09:00,7218,5465,5679,11572,14335,9063,5636,1881,2018,0,215,28.07,40,45.014436,38.896566,13\n2026-04-21 12:09:15,7370,5345,5796,11305,14298,8789,5564,1791,2057,3776,221,28.08,40,45.014189,38.895927,13\n2026-04-21 12:09:30,7553,5236,6006,11489,14272,8803,5489,1844,2083,3743,179,28.35,39,45.016533,38.897884,11\n2026-04-21 12:09:45,7711,5563,5742,11856,14411,8813,5633,1920,2072,5,242,28.35,41,45.016767,38.897092,13\n2026-04-21 12:10:00,7579,5350,6025,11702,14021,9207,5587,1961,2062,3733,188,28.05,42,45.017969,38.898258,12\n2026-04-21 12:10:15,7478,5520,5773,11834,14244,8862,5628,1964,2085,0,229,28.27,40,45.018015,38.897430,13\n2026-04-21 12:10:30,7714,5459,5993,12025,13887,9004,5551,1842,2062,29,200,28.27,42,45.019008,38.898533,12\n2026-04-21 12:10:45,7456,5417,5776,11718,14063,9320,5420,1903,2116,0,180,28.35,42,45.020771,38.897833,12\n2026-04-21 12:11:00,7786,5610,5855,11449,14199,9300,5582,1898,2063,0,213,28.45,43,45.021447,38.898047,12\n2026-04-21 12:11:15,7431,5526,5761,11686,14281,9212,5511,2024,2066,28,186,28.41,44,45.023104,38.898909,11\n2026-04-21 12:11:30,7443,5337,5893,11453,14404,9332,5692,1858,2098,35,191,28.40,40,45.022966,38.898139,12\n2026-04-21 12:11:45,7717,5529,5843,12024,14407,9432,5459,1999,2157,0,158,28.53,41,45.023831,38.899305,10\n2026-04-21 12:12:00,7602,5614,5840,11582,13928,9583,5486,2023,2113,31,185,28.67,41,45.024660,38.899753,13\n2026-04-21 12:12:15,7783,5477,5766,11933,14030,9282,5616,1956,2175,0,182,28.41,42,45.026421,38.899039,13\n2026-04-21 12:12:30,7495,5717,5855,11835,13934,9644,5496,1910,2140,45,202,28.64,42,45.027978,38.900312,10\n2026-04-21 12:12:45,7634,5502,6024,11512,13937,9650,5452,1974,2211,6,212,28.65,44,45.028377,38.899849,12\n2026-04-21 12:13:00,7301,5420,5913,11580,13845,9654,5520,1961,2195,0,219,28.48,40,45.028910,38.899371,10\n2026-04-21 12:13:15,7742,5486,5964,12001,13995,9631,5460,1961,2170,0,179,28.51,43,45.029547,38.900779,12\n2026-04-21 12:13:30,7560,5705,6014,11764,14220,9440,5661,1976,2132,14,150,28.37,41,45.030739,38.900016,12\n2026-04-21 12:13:45,7481,5519,5964,11963,14042,9539,5431,1993,2190,73,156,28.44,41,45.032525,38.901156,13\n2026-04-21 12:14:00,7538,5793,5855,11510,13780,9794,5559,1961,2144,4,172,28.75,40,45.033181,38.901093,11\n2026-04-21 12:14:15,7430,5692,5947,11680,14147,9665,5531,1932,2241,1,160,28.63,44,45.034981,38.900545,12\n2026-04-21 12:14:30,7290,5750,5792,11371,13844,9414,5499,1936,2159,0,192,28.72,40,45.034818,38.900848,11\n2026-04-21 12:14:45,7288,5627,5951,11901,13688,9847,5684,1925,2262,30,199,28.73,43,45.035444,38.901112,10\n2026-04-21 12:15:00,7520,5849,5847,11365,14120,9395,5487,1968,2230,0,144,28.84,40,45.036973,38.902257,10\n2026-04-21 12:15:15,7650,5591,5670,11765,13691,9684,5561,1989,2220,0,174,28.90,41,45.038444,38.902951,12\n2026-04-21 12:15:30,7531,5748,5647,11752,14013,9592,5644,2098,2230,0,213,28.92,43,45.039198,38.903177,12\n2026-04-21 12:15:45,7514,5867,5583,11801,13622,9939,5655,1977,2228,0,152,28.64,40,45.040365,38.902598,12\n2026-04-21 12:16:00,7550,5910,5990,11491,14279,9872,5676,2106,2319,0,162,28.74,43,45.039229,38.903684,12\n2026-04-21 12:16:15,7500,5882,5930,11514,13943,9900,5735,2105,2331,15,171,28.61,41,45.040160,38.905256,12\n2026-04-21 12:16:30,7578,6057,5861,11765,13891,10140,5549,1990,2359,61,155,28.60,41,45.039159,38.906130,12\n2026-04-21 12:16:45,7815,5940,5844,12022,14041,9709,5714,2034,2317,0,206,28.97,41,45.040364,38.907355,12\n2026-04-21 12:17:00,7584,6207,5916,12086,14374,9906,5700,2134,2449,50,143,28.68,42,45.040699,38.909991,12\n2026-04-21 12:17:15,7911,6002,5899,12081,14106,10254,5815,2135,2414,48,198,28.91,42,45.040221,38.910209,10\n2026-04-21 12:17:30,7995,5997,6183,11817,14108,10092,5802,2079,2423,0,156,29.02,44,45.039444,38.911142,11\n2026-04-21 12:17:45,7733,6232,6049,12143,14098,10106,5867,2118,2499,43,173,29.01,42,45.039683,38.913341,10\n2026-04-21 12:18:00,8083,6358,6014,11982,14607,10501,5628,2219,2504,18,168,29.10,43,45.040177,38.914400,10\n2026-04-21 12:18:15,7886,6452,6285,12196,14328,10694,5693,2176,2519,66,165,28.88,42,45.039487,38.916616,11\n2026-04-21 12:18:30,8156,6544,6241,11991,14668,10484,5839,2171,2546,0,189,28.85,42,45.040350,38.917551,12\n2026-04-21 12:18:45,8268,6286,6185,12460,14609,10562,5788,2212,2641,22,146,29.13,42,45.039985,38.918483,12\n2026-04-21 12:19:00,8096,6353,6226,12076,14582,10786,6062,2227,2647,44,174,29.06,42,45.039810,38.919404,11\n2026-04-21 12:19:15,8358,6505,6247,12240,14895,10572,5903,2293,2652,13,134,29.03,42,45.039529,38.919898,11\n2026-04-21 12:19:30,8431,6629,6278,12555,14894,10596,5801,2313,2655,0,127,28.95,44,45.040712,38.921534,10\n2026-04-21 12:19:45,8374,6711,6562,12597,14612,10744,5894,2384,2697,0,167,28.96,43,45.040019,38.923027,12\n2026-04-21 12:20:00,8165,6865,6641,12605,14709,11057,6143,2410,2807,58,158,28.90,41,45.039694,38.924594,11\n2026-04-21 12:20:15,8212,6731,6665,12366,15089,10696,6036,2292,2762,0,155,29.30,42,45.039754,38.925861,12\n2026-04-21 12:20:30,8263,6917,6420,12787,14600,10975,6015,2359,2818,0,186,29.15,40,45.041040,38.926297,11\n2026-04-21 12:20:45,8314,6865,6566,12750,15156,10778,6211,2353,2902,0,165,29.13,44,45.040059,38.927749,12\n2026-04-21 12:21:00,8552,6999,6572,12269,14605,11050,5979,2449,2851,0,185,29.10,43,45.041250,38.928667,10\n2026-04-21 12:21:15,8571,7003,6755,12572,14729,11226,6089,2430,2940,39,175,29.03,42,45.041731,38.930655,12\n2026-04-21 12:21:30,8431,7393,6769,12527,14979,11455,6074,2441,2939,0,124,29.09,43,45.040800,38.931900,11\n2026-04-21 12:21:45,8379,7441,6740,12765,14724,11218,6147,2369,2969,51,182,29.06,42,45.042186,38.932927,11\n2026-04-21 12:22:00,8465,7516,6638,12944,14874,11020,6297,2392,2983,0,156,29.05,41,45.040882,38.932990,11\n2026-04-21 12:22:15,8830,7673,6766,12987,15107,11552,6287,2434,3085,0,149,29.39,40,45.041339,38.935879,12\n2026-04-21 12:22:30,8539,7731,6572,12480,14987,11548,6149,2421,3096,73,143,29.36,41,45.042382,38.936233,11\n2026-04-21 12:22:45,8842,7522,6928,12931,14710,11578,6322,2547,3092,26609,150,29.26,41,45.041677,38.937907,12\n2026-04-21 12:23:00,8837,7793,6876,12860,14730,11633,6189,2578,3089,26650,154,29.51,42,45.041786,38.939028,12\n2026-04-21 12:23:15,8785,7840,6832,12812,14661,11746,6192,2528,3093,26638,153,29.51,41,45.043176,38.939320,11\n2026-04-21 12:23:30,8835,7827,6918,12520,14789,11558,6328,2477,3197,26590,128,29.46,43,45.043709,38.941380,12\n2026-04-21 12:23:45,9072,7934,6625,13009,14690,11741,6165,2608,3149,26602,130,29.52,43,45.043940,38.941249,10\n2026-04-21 12:24:00,9125,8192,6983,13154,14884,11842,6151,2585,3290,26663,178,29.19,40,45.042942,38.943483,11\n2026-04-21 12:24:15,9176,8243,6934,12613,15357,12059,6209,2558,3298,26611,162,29.36,44,45.043116,38.943562,10\n2026-04-21 12:24:30,9216,8388,6748,12878,15060,12089,6164,2607,3338,26658,147,29.41,41,45.044088,38.946177,11\n2026-04-21 12:24:45,8925,8164,6967,12613,15429,11904,6283,2639,3307,26663,123,29.58,42,45.044666,38.947241,10\n2026-04-21 12:25:00,8968,8433,6882,13015,14779,12208,6374,2640,3403,26606,171,29.51,41,45.044606,38.948432,11\n2026-04-21 12:25:15,8975,8555,6977,12733,15301,12360,6212,2590,3439,26600,146,29.51,43,45.044599,38.949830,12\n2026-04-21 12:25:30,8918,8546,6722,12615,14851,12378,6219,2693,3423,26651,150,29.40,41,45.045254,38.949926,12\n2026-04-21 12:25:45,9281,8724,6962,12998,15007,12222,6411,2682,3476,26663,165,29.55,41,45.045354,38.951877,12\n2026-04-21 12:26:00,9135,8869,6799,12842,14823,12255,6239,2683,3472,26663,100,29.48,40,45.045716,38.953823,10\n2026-04-21 12:26:15,9423,8629,6993,12858,15213,12307,6322,2709,3504,26653,159,29.58,42,45.044677,38.954356,10\n2026-04-21 12:26:30,9174,8905,6788,12915,14817,12511,6397,2678,3507,26663,112,29.39,42,45.045953,38.955754,11\n2026-04-21 12:26:45,9483,8940,6744,12933,15466,12167,6493,2755,3466,26663,163,29.28,42,45.045141,38.956333,11\n2026-04-21 12:27:00,9099,9005,6930,12938,15356,12220,6307,2725,3533,26663,98,29.56,42,45.046312,38.957294,12\n2026-04-21 12:27:15,9191,9000,6880,12902,15481,12700,6454,2724,3559,26663,153,29.41,44,45.045582,38.958798,9\n2026-04-21 12:27:30,9036,8877,6833,12771,15130,12341,6356,2798,3535,26632,168,29.67,41,45.046449,38.960180,10\n2026-04-21 12:27:45,9347,8884,6984,13100,15088,12774,6622,2768,3542,26663,101,29.35,42,45.045035,38.961843,11\n2026-04-21 12:28:00,9319,8859,6961,12868,15404,12896,6487,2755,3569,26663,128,29.76,40,45.045111,38.963249,12\n2026-04-21 12:28:15,9565,9078,6877,12905,15099,12899,6481,2746,3574,26663,115,29.40,42,45.045863,38.965900,12\n2026-04-21 12:28:30,9573,9017,6820,12933,14939,12566,6678,2743,3587,26609,135,29.59,43,45.046560,38.967293,11\n2026-04-21 12:28:45,9364,9147,7072,13183,14917,12657,6561,2846,3560,26637,131,29.55,41,45.046469,38.969030,11\n2026-04-21 12:29:00,9679,9145,6974,12804,15216,13000,6550,2803,3624,26600,135,29.58,42,45.045374,38.970459,10\n2026-04-21 12:29:15,9659,9121,6925,12886,15507,13126,6607,2765,3577,26663,105,29.42,40,45.045554,38.971931,10\n2026-04-21 12:29:30,9567,8991,6855,13142,15129,12946,6658,2866,3583,26627,139,29.51,43,45.045404,38.971861,9\n2026-04-21 12:29:45,9374,9166,7010,12852,15555,13234,6531,2883,3574,26663,136,29.51,42,45.045853,38.974011,10\n2026-04-21 12:30:00,9648,9212,6821,12755,15075,12810,6414,2873,3643,26663,125,29.58,42,45.046086,38.974679,11\n2026-04-21 12:30:15,9443,8886,6835,13198,15607,13219,6718,2882,3634,26663,127,29.67,40,45.045682,38.977011,10\n2026-04-21 12:30:30,9802,9074,6816,13272,15041,12998,6649,2855,3631,26624,154,29.60,41,45.046159,38.978570,12\n2026-04-21 12:30:45,9859,8930,6906,12986,15136,13047,6796,2901,3602,26663,95,29.42,43,45.046423,38.980463,11\n2026-04-21 12:31:00,9727,9052,6738,13020,14997,12998,6465,2897,3601,26663,106,29.81,43,45.046354,38.980506,12\n2026-04-21 12:31:15,9819,8796,6867,13073,14991,13389,6817,2807,3667,26625,141,29.75,39,45.045408,38.982602,9\n2026-04-21 12:31:30,9499,8753,6806,13089,15496,13103,6670,2864,3614,26623,137,29.65,43,45.046732,38.983476,10\n2026-04-21 12:31:45,9864,8804,6952,12831,15192,13203,6508,2894,3587,26663,114,29.44,43,45.047535,38.981875,11\n2026-04-21 12:32:00,9418,8910,6671,12733,15420,13157,6486,2785,3597,26663,92,29.51,41,45.048260,38.979865,11\n2026-04-21 12:32:15,9554,8771,6760,13028,15314,12998,6606,2747,3625,26663,123,29.42,42,45.048792,38.978945,12\n2026-04-21 12:32:30,9410,8811,6740,12541,14962,13164,6559,2735,3664,26612,127,29.63,42,45.049409,38.978254,9\n2026-04-21 12:32:45,9412,8704,6706,12832,15132,12833,6550,2753,3654,26633,124,29.52,44,45.049305,38.976672,10\n2026-04-21 12:33:00,9568,8485,6850,12730,15006,13094,6514,2808,3544,26598,108,29.59,43,45.050236,38.975385,10\n2026-04-21 12:33:15,9183,8529,6572,12777,15309,13135,6614,2773,3543,26649,111,29.60,44,45.050478,38.974064,10\n2026-04-21 12:33:30,9153,8409,6499,12598,15015,13019,6532,2827,3563,26663,131,29.70,42,45.051394,38.972712,10\n2026-04-21 12:33:45,9235,8451,6819,12444,15264,12883,6388,2805,3535,26606,82,29.41,41,45.051358,38.970916,11\n2026-04-21 12:34:00,9220,8466,6549,12845,15175,12900,6406,2766,3610,26663,74,29.42,43,45.052453,38.970212,9\n2026-04-21 12:34:15,9247,8199,6558,12631,14983,13021,6255,2681,3587,26663,75,29.66,42,45.052706,38.968015,11\n2026-04-21 12:34:30,9242,8118,6648,12298,15030,12749,6315,2678,3592,26663,113,29.80,43,45.053065,38.967989,12\n2026-04-21 12:34:45,9235,8297,6565,12338,14891,12804,6364,2749,3581,26640,91,29.78,42,45.052603,38.966160,12\n2026-04-21 12:35:00,8834,8190,6574,12448,14802,12645,6309,2761,3524,26642,84,29.64,40,45.053315,38.964068,10\n2026-04-21 12:35:15,9060,8242,6574,12743,14589,12446,6480,2629,3556,26663,128,29.71,40,45.053900,38.964142,12\n2026-04-21 12:35:30,8814,8057,6583,12428,15064,12322,6407,2733,3474,26661,117,29.69,42,45.054907,38.962196,12\n2026-04-21 12:35:45,8772,7859,6525,12543,14782,12629,6074,2638,3449,26663,130,29.57,41,45.055060,38.960151,11\n2026-04-21 12:36:00,8694,8037,6406,12463,14393,12281,6184,2590,3472,26642,88,29.50,41,45.055448,38.959813,9\n2026-04-21 12:36:15,8843,7964,6397,12466,14618,12147,6158,2560,3508,26663,98,29.74,41,45.055360,38.957724,11\n2026-04-21 12:36:30,8802,7882,6380,12362,14793,12626,6063,2549,3453,22733,77,29.61,44,45.056329,38.957853,12\n2026-04-21 12:36:45,8696,7870,6268,12091,14626,12521,6127,2623,3490,22763,82,29.57,42,45.056651,38.956701,10\n2026-04-21 12:37:00,8436,7746,6163,12120,14282,12353,6229,2549,3415,26620,82,29.33,43,45.055956,38.953895,11\n2026-04-21 12:37:15,8682,7620,6102,12369,14262,12154,5943,2567,3365,26663,85,29.35,41,45.057390,38.952380,10\n2026-04-21 12:37:30,8470,7352,6291,12330,14475,11983,5977,2595,3279,26663,120,29.42,44,45.057866,38.951684,11\n2026-04-21 12:37:45,8405,7290,6033,12380,14327,12184,6172,2549,3355,22761,104,29.64,41,45.058038,38.951187,11\n2026-04-21 12:38:00,8273,7248,6085,11948,14115,11925,5847,2518,3223,26618,86,29.68,40,45.058094,38.949495,12\n2026-04-21 12:38:15,8162,7269,5914,11678,14279,11715,6111,2552,3249,22774,118,29.63,43,45.059614,38.948276,11\n2026-04-21 12:38:30,8526,7005,6145,11611,14392,11956,5833,2526,3175,26663,75,29.31,44,45.060189,38.947100,11\n2026-04-21 12:38:45,8088,7032,6115,11839,14484,11766,5745,2364,3109,22788,90,29.32,44,45.060535,38.945468,12\n2026-04-21 12:39:00,8336,7143,6035,11860,14324,11526,5732,2465,3115,26663,81,29.41,44,45.060094,38.944347,10\n2026-04-21 12:39:15,8291,7173,5867,11850,14214,11681,5743,2473,3100,22864,89,29.32,44,45.060601,38.944384,11\n2026-04-21 12:39:30,8182,6780,5962,11751,14384,11712,5879,2403,3049,22869,105,29.47,43,45.061603,38.943288,10\n2026-04-21 12:39:45,7939,6775,5722,11446,13952,11872,5787,2415,3007,22770,102,29.60,41,45.061688,38.942289,10\n2026-04-21 12:40:00,7830,6924,5836,11586,14242,11729,5729,2398,2967,22762,125,29.32,42,45.062147,38.941259,11\n2026-04-21 12:40:15,7817,6889,5603,11373,14061,11433,5818,2365,2993,22803,83,29.43,42,45.063334,38.939435,10\n2026-04-21 12:40:30,7979,6787,5761,11223,13911,11107,5839,2244,2910,26605,82,29.49,41,45.063864,38.937398,11\n2026-04-21 12:40:45,8031,6491,5825,11422,14085,11122,5567,2251,2879,22747,112,29.45,43,45.063275,38.936457,12\n2026-04-21 12:41:00,7757,6524,5684,11011,14048,11406,5776,2257,2884,22826,86,29.37,44,45.065315,38.935237,10\n2026-04-21 12:41:15,7613,6560,5556,11398,13961,11107,5660,2285,2858,22779,87,29.48,42,45.065238,38.935399,10\n2026-04-21 12:41:30,7441,6586,5544,11179,13988,11146,5653,2258,2801,26610,92,29.44,44,45.064997,38.934050,10\n2026-04-21 12:41:45,7538,6356,5553,11321,13660,11218,5492,2165,2747,22813,78,29.10,42,45.065489,38.933504,12\n2026-04-21 12:42:00,7565,6352,5458,11085,13441,10893,5466,2116,2651,22866,81,29.36,43,45.067281,38.930986,10\n2026-04-21 12:42:15,7410,6465,5274,10797,13852,10936,5696,2210,2701,22826,74,29.08,43,45.067183,38.930050,10\n2026-04-21 12:42:30,7636,6285,5298,10928,13793,10678,5413,2191,2698,22853,119,29.34,45,45.066997,38.929539,12\n2026-04-21 12:42:45,7518,6332,5086,10599,13711,10799,5331,2117,2582,22829,105,29.22,45,45.068616,38.928641,10\n2026-04-21 12:43:00,7234,6187,5228,10672,13559,10586,5357,2136,2649,22731,76,29.25,43,45.068054,38.927413,12\n2026-04-21 12:43:15,7262,6218,5284,11010,13401,10856,5502,2155,2501,22845,78,29.05,41,45.068656,38.925501,11\n2026-04-21 12:43:30,7147,6285,5226,10802,13074,10438,5281,2097,2557,22849,77,29.34,43,45.068877,38.924475,11\n2026-04-21 12:43:45,7164,6056,5183,10411,13450,10474,5361,1977,2482,22834,90,29.00,44,45.069086,38.922788,11\n2026-04-21 12:44:00,7286,6015,4976,10514,13477,10635,5392,2094,2444,22817,81,28.93,45,45.070854,38.922880,10\n2026-04-21 12:44:15,7058,5919,4983,10454,13173,10104,5169,2024,2404,22863,88,29.12,43,45.070412,38.921975,11\n2026-04-21 12:44:30,7049,5837,5001,10618,13122,10479,5191,2050,2414,22782,84,29.32,43,45.071287,38.920700,11\n2026-04-21 12:44:45,6897,6074,4924,10328,13192,9991,5171,1956,2392,22776,71,29.30,44,45.071181,38.918079,11\n2026-04-21 12:45:00,6827,5943,4839,10497,13131,10399,5276,1950,2302,22816,83,29.19,45,45.071608,38.918186,11\n2026-04-21 12:45:15,6861,5886,4749,10251,13275,10302,5173,1925,2273,22778,74,29.07,43,45.071476,38.916004,10\n2026-04-21 12:45:30,6566,5690,4775,10248,12831,10039,5393,1900,2302,22804,83,29.12,42,45.071384,38.915920,11\n2026-04-21 12:45:45,6991,5753,4765,10518,13039,9930,5021,1827,2203,22788,95,29.02,43,45.071779,38.913960,11\n2026-04-21 12:46:00,6612,5633,4503,10196,12858,9668,5213,1921,2183,22738,88,28.81,42,45.073127,38.913409,12\n2026-04-21 12:46:15,6687,5668,4670,10279,12482,9781,5313,1917,2206,22780,76,29.14,43,45.073598,38.912659,12\n2026-04-21 12:46:30,6386,5746,4601,9896,12874,9864,4995,1864,2189,22730,82,29.02,41,45.072535,38.911401,11\n2026-04-21 12:46:45,6461,5757,4535,9798,12804,9793,4936,1761,2180,22794,81,28.83,43,45.073885,38.909726,13\n2026-04-21 12:47:00,6405,5701,4728,9861,12596,9863,5081,1793,2113,22727,73,29.09,44,45.073409,38.910352,11\n2026-04-21 12:47:15,6485,5804,4449,10121,12855,9655,5082,1774,2143,22818,84,29.07,43,45.074062,38.911838,12\n2026-04-21 12:47:30,6547,5754,4635,9973,12552,9725,5057,1779,2095,22805,75,28.75,44,45.075270,38.912087,13\n2026-04-21 12:47:45,6784,5805,4668,9698,12545,9658,5264,1812,2138,22798,90,28.83,43,45.075870,38.913458,13\n2026-04-21 12:48:00,6610,5536,4531,10217,12870,10047,5184,1759,2144,22755,85,28.86,41,45.076660,38.914050,12\n2026-04-21 12:48:15,6290,5596,4589,9995,12522,9967,5125,1875,2168,22742,87,28.93,42,45.077358,38.915047,11\n2026-04-21 12:48:30,6265,5652,4426,9642,12286,9597,5108,1755,2151,22828,90,28.91,45,45.078344,38.914908,11\n2026-04-21 12:48:45,6490,5689,4472,9830,12617,10010,5039,1877,2070,22811,84,28.84,44,45.078648,38.915880,12\n2026-04-21 12:49:00,6512,5510,4246,10054,12635,9631,5060,1864,2106,18955,75,29.01,43,45.079903,38.916766,13\n2026-04-21 12:49:15,6596,5547,4358,10087,12715,9746,5240,1903,2081,22834,88,28.69,45,45.079489,38.918828,11\n2026-04-21 12:49:30,6615,5617,4343,9929,12656,9637,4925,1904,2130,18992,84,28.67,43,45.080609,38.918594,11\n2026-04-21 12:49:45,6495,5511,4350,9752,12662,9752,5051,1844,2146,22861,85,28.74,45,45.082244,38.920693,10\n2026-04-21 12:50:00,6451,5640,4235,9897,12762,10041,5175,1885,2092,22783,78,28.91,41,45.081493,38.920899,12\n2026-04-21 12:50:15,6580,5466,4375,9549,12215,9793,4896,1870,2038,22774,73,28.67,45,45.083703,38.921831,11\n2026-04-21 12:50:30,6185,5513,4196,9527,12587,10111,4973,1819,2005,18974,73,28.59,46,45.084506,38.921872,12\n2026-04-21 12:50:45,6640,5571,4221,9986,12727,10060,4919,1775,2074,22787,78,28.87,43,45.083866,38.924038,13\n2026-04-21 12:51:00,6163,5430,4275,9831,12775,9658,4883,1848,2051,19074,79,28.76,43,45.085132,38.924116,11\n2026-04-21 12:51:15,6527,5662,4203,9620,12134,9847,5138,1884,2078,22786,75,28.75,44,45.086062,38.926423,11\n2026-04-21 12:51:30,6486,5767,4256,9676,12719,9881,4953,1844,2059,22842,87,28.43,46,45.086343,38.927394,11\n2026-04-21 12:51:45,6080,5725,4175,9583,12262,9990,5126,1809,2042,19064,87,28.62,45,45.087849,38.927603,12\n2026-04-21 12:52:00,6214,5526,4153,9274,12629,10100,4935,1883,2100,18964,73,28.76,45,45.088421,38.929378,13\n2026-04-21 12:52:15,6488,5502,4179,9334,12581,10065,4814,1707,2054,18973,80,28.37,45,45.090367,38.929549,11\n2026-04-21 12:52:30,6202,5447,4111,9214,11956,10049,4861,1841,2030,19017,83,28.63,42,45.089924,38.929993,10\n2026-04-21 12:52:45,6244,5402,3986,9518,11887,9808,5110,1750,1963,19073,93,28.62,44,45.091949,38.931241,12\n2026-04-21 12:53:00,6027,5423,4126,9465,12530,10107,4890,1768,2049,19022,82,28.39,45,45.092861,38.933507,12\n2026-04-21 12:53:15,6190,5575,4091,9572,12495,9915,5001,1805,2040,18934,88,28.49,44,45.092872,38.933409,11\n2026-04-21 12:53:30,6345,5636,3912,9389,12354,9896,5061,1712,1951,18997,91,28.60,46,45.094053,38.935310,12\n2026-04-21 12:53:45,6232,5427,3919,9053,12055,9741,5101,1722,1953,22739,99,28.60,43,45.094246,38.935780,11\n2026-04-21 12:54:00,5973,5472,3816,9448,12128,9530,5037,1709,1956,18942,72,28.28,44,45.095923,38.936511,13\n2026-04-21 12:54:15,6187,5596,3982,8979,11769,9755,4776,1828,2021,19014,82,28.54,45,45.095802,38.937541,10\n2026-04-21 12:54:30,6074,5415,3745,9354,12195,9518,4786,1678,1949,18991,94,28.35,43,45.098192,38.939669,11\n2026-04-21 12:54:45,5901,5639,3671,9420,12352,9936,4827,1697,1974,19020,77,28.21,45,45.097701,38.940697,12\n2026-04-21 12:55:00,5999,5506,3791,8935,11716,9815,4885,1700,1953,18989,87,28.24,45,45.099626,38.940970,11\n2026-04-21 12:55:15,5995,5268,3871,9233,11668,9704,4889,1786,1935,22846,80,28.41,43,45.100476,38.943029,13\n2026-04-21 12:55:30,6027,5393,3806,9094,12103,9698,5037,1656,1952,19005,102,28.09,45,45.100010,38.944159,10\n2026-04-21 12:55:45,5934,5611,3811,8822,12083,9964,4821,1778,1955,22771,76,28.03,46,45.100857,38.944310,10\n2026-04-21 12:56:00,6149,5225,3758,8852,11612,9656,4791,1687,1920,19009,83,28.28,42,45.102798,38.945293,13\n2026-04-21 12:56:15,5953,5546,3640,9184,12033,9572,4914,1701,1889,22862,86,28.18,45,45.102978,38.945799,10\n2026-04-21 12:56:30,5716,5294,3787,8788,12211,9865,4885,1631,1873,19001,71,28.11,43,45.102862,38.947236,12\n2026-04-21 12:56:45,6088,5253,3551,9152,12089,9565,4654,1609,1874,18940,88,28.33,44,45.104216,38.948407,11\n2026-04-21 12:57:00,5895,5233,3673,8707,12044,9430,4852,1740,1878,18949,77,28.05,44,45.104907,38.950063,12\n2026-04-21 12:57:15,5983,5260,3520,8586,12018,9803,4631,1731,1902,19009,73,27.90,46,45.105480,38.949709,10\n2026-04-21 12:57:30,5719,5381,3432,9008,11872,9743,4645,1568,1837,18999,72,28.11,44,45.106944,38.950402,13\n2026-04-21 12:57:45,5674,5341,3363,8779,11856,9325,4622,1633,1880,19061,86,27.87,47,45.107661,38.951951,11\n2026-04-21 12:58:00,5595,5463,3413,8470,11822,9198,4756,1602,1788,18931,84,27.89,47,45.108326,38.952489,10\n2026-04-21 12:58:15,5754,5296,3286,8450,11332,9195,4669,1685,1855,18980,76,27.78,44,45.108800,38.953345,10\n2026-04-21 12:58:30,5829,5433,3530,8837,11860,9720,4767,1664,1867,19054,72,27.96,46,45.108733,38.953911,12\n2026-04-21 12:58:45,5538,5424,3257,8515,11377,9592,4700,1665,1779,19015,81,27.98,44,45.110435,38.954980,13\n2026-04-21 12:59:00,5627,5104,3222,8419,11262,9449,4588,1560,1791,19044,74,27.89,43,45.110849,38.955844,13\n2026-04-21 12:59:15,5812,5151,3463,8289,11942,9343,4751,1526,1823,18940,80,27.66,45,45.110776,38.956614,12\n2026-04-21 12:59:30,5571,5301,3412,8618,11492,9500,4815,1559,1755,18932,76,27.89,45,45.112000,38.957866,11\n2026-04-21 12:59:45,5620,5068,3411,8463,11336,9411,4592,1487,1731,19036,92,27.90,44,45.113666,38.959245,13\n2026-04-21 13:00:00,5748,5180,3293,8318,11686,9207,4735,1551,1697,18985,87,27.67,44,45.114698,38.959341,13\n2026-04-21 13:00:15,5444,5081,3114,8199,11442,8932,4653,1486,1770,18986,82,27.68,44,45.115407,38.960238,10\n2026-04-21 13:00:30,5321,5340,3364,8206,11114,9366,4654,1490,1726,18997,83,27.66,46,45.115956,38.961025,12\n2026-04-21 13:00:45,5772,5074,3119,8222,11323,8948,4745,1552,1721,19052,93,27.67,44,45.115619,38.961764,12\n2026-04-21 13:01:00,5579,5280,3079,8551,11084,9077,4759,1576,1731,19069,72,27.71,45,45.117602,38.962991,12\n2026-04-21 13:01:15,5593,5107,3055,8516,11231,8873,4678,1491,1700,18939,86,27.78,46,45.118321,38.963930,11\n2026-04-21 13:01:30,5405,5056,3309,8369,11365,8888,4535,1505,1656,19014,77,27.67,46,45.118287,38.963076,11\n2026-04-21 13:01:45,5618,5107,3206,8439,11027,8891,4419,1466,1623,18953,79,27.40,47,45.119369,38.964332,13\n2026-04-21 13:02:00,5525,5227,3263,8345,11205,8608,4698,1385,1631,18994,87,27.44,46,45.120398,38.966339,12\n2026-04-21 13:02:15,5316,4937,3014,8181,11563,8618,4603,1532,1663,19069,84,27.55,46,45.120895,38.967202,13\n2026-04-21 13:02:30,5294,4962,3088,8297,11234,8837,4735,1532,1710,19051,76,27.67,46,45.120296,38.967513,11\n2026-04-21 13:02:45,5467,5154,3036,8379,11228,8963,4495,1484,1648,18950,81,27.58,42,45.120976,38.970047,11\n2026-04-21 13:03:00,5374,5010,3119,8029,11427,9217,4455,1495,1739,19010,78,27.46,45,45.119767,38.971378,11\n2026-04-21 13:03:15,5382,5080,3178,8441,11576,8883,4652,1527,1683,15158,79,27.55,43,45.120428,38.973446,11\n2026-04-21 13:03:30,5462,5128,3077,8140,11633,8847,4602,1577,1678,19046,71,27.53,45,45.119396,38.974994,13\n2026-04-21 13:03:45,5755,5202,3021,8003,11098,9256,4595,1560,1702,18964,89,27.14,45,45.119266,38.976751,12\n2026-04-21 13:04:00,5423,5327,3316,8455,11317,9123,4553,1553,1765,19010,87,27.23,46,45.119098,38.977256,13\n2026-04-21 13:04:15,5754,5110,3144,8564,11301,9393,4759,1465,1797,18992,85,27.46,43,45.118911,38.980754,12\n2026-04-21 13:04:30,5649,5133,3162,8181,11621,9026,4472,1556,1678,18990,85,27.33,44,45.119755,38.982277,10\n2026-04-21 13:04:45,5744,5359,3113,8073,11284,9122,4809,1527,1786,19004,88,27.28,46,45.118715,38.983370,11\n2026-04-21 13:05:00,5485,5104,3205,8597,11298,9313,4711,1579,1769,18970,82,26.98,44,45.118898,38.985628,11\n2026-04-21 13:05:15,5672,5074,3169,8196,11247,9160,4595,1524,1743,15149,85,26.99,46,45.117671,38.986157,11\n2026-04-21 13:05:30,5861,5076,3124,8162,11277,9469,4763,1515,1760,18952,80,27.31,46,45.117782,38.989181,13\n2026-04-21 13:05:45,5727,5444,3179,8405,11699,9542,4537,1523,1756,15222,88,26.99,45,45.117447,38.991191,13\n2026-04-21 13:06:00,5685,5229,3143,8466,11092,9264,4646,1497,1749,15152,85,27.19,43,45.117357,38.991688,13\n2026-04-21 13:06:15,5569,5181,3310,8361,11690,9541,4708,1639,1854,15254,74,27.21,47,45.116714,38.993235,11\n2026-04-21 13:06:30,5844,5476,3430,8201,11750,9438,4795,1578,1830,18983,76,27.11,43,45.115435,38.994822,13\n2026-04-21 13:06:45,5771,5331,3209,8396,11331,9400,4673,1595,1873,19014,91,26.90,45,45.115058,38.997599,10\n2026-04-21 13:07:00,5845,5429,3264,8639,11777,9270,4804,1674,1897,15163,83,27.02,45,45.114516,38.999652,11\n2026-04-21 13:07:15,5670,5289,3362,8284,11826,9688,4863,1694,1910,19034,96,27.10,46,45.113974,39.000485,12\n2026-04-21 13:07:30,6048,5199,3165,8431,11268,9644,4824,1698,1908,19014,80,26.68,46,45.114071,39.001607,12\n2026-04-21 13:07:45,5737,5364,3532,8492,11679,9361,4665,1617,1966,15242,108,27.05,46,45.112729,39.003467,11\n2026-04-21 13:08:00,6039,5509,3304,8464,11869,9593,4855,1676,1907,18983,80,26.88,44,45.112298,39.005929,13\n2026-04-21 13:08:15,5811,5506,3334,8554,11335,9691,4889,1599,1942,15249,74,26.66,45,45.112030,39.007571,10\n2026-04-21 13:08:30,6010,5447,3266,8865,11786,9885,4683,1610,1906,19074,92,26.89,43,45.111649,39.009277,12\n2026-04-21 13:08:45,5784,5571,3502,8771,11731,9457,4746,1735,1927,19050,102,26.89,43,45.110963,39.011543,12\n2026-04-21 13:09:00,6055,5336,3506,8338,11455,9401,4774,1592,1985,15191,87,26.55,46,45.111346,39.012672,12\n2026-04-21 13:09:15,5741,5572,3474,8908,11602,9424,4834,1647,1974,15259,87,26.61,46,45.110969,39.014495,11\n2026-04-21 13:09:30,6125,5569,3562,8574,11490,9902,5056,1640,2005,15259,121,26.50,46,45.109855,39.016267,13\n2026-04-21 13:09:45,6162,5407,3318,8722,11859,9716,5016,1669,2027,15260,79,26.58,45,45.109869,39.017765,13\n2026-04-21 13:10:00,5916,5495,3377,8689,11595,9553,4716,1652,1973,15204,93,26.50,46,45.109581,39.019828,12\n2026-04-21 13:10:15,6052,5678,3474,8737,11653,9959,4730,1767,2036,19026,85,26.34,44,45.108708,39.021364,10\n2026-04-21 13:10:30,6002,5395,3597,8752,11978,9551,4980,1619,2035,15168,107,26.40,47,45.108199,39.022621,12\n2026-04-21 13:10:45,6014,5536,3581,8882,12018,10019,5037,1654,2071,15204,89,26.60,43,45.107070,39.024276,13\n2026-04-21 13:11:00,6275,5610,3542,8974,11591,9852,5041,1653,2001,15181,79,26.39,44,45.107421,39.026432,13\n2026-04-21 13:11:15,6114,5504,3618,8579,11434,9831,5044,1639,2010,15251,94,26.20,46,45.107157,39.026826,10\n2026-04-21 13:11:30,6230,5535,3439,8558,12069,10055,4873,1634,2012,15191,130,26.19,44,45.106412,39.028694,11\n2026-04-21 13:11:45,6189,5552,3618,8501,11555,9594,5089,1751,2015,15141,106,26.46,44,45.106386,39.030005,13\n2026-04-21 13:12:00,6226,5455,3390,8581,11670,9748,5009,1742,2042,15229,75,26.12,45,45.104899,39.031524,12\n2026-04-21 13:12:15,6201,5651,3419,8599,11941,9809,5028,1705,2091,15196,82,26.45,44,45.104555,39.034774,10\n2026-04-21 13:12:30,6293,5639,3515,8636,11734,9922,4872,1657,2129,15213,85,26.21,46,45.103682,39.035407,10\n2026-04-21 13:12:45,6290,5426,3362,8966,11773,10019,4816,1746,2106,15255,82,26.19,47,45.104486,39.037177,12\n2026-04-21 13:13:00,6197,5532,3550,8990,11462,9711,4881,1726,2019,15222,83,26.08,44,45.103830,39.038537,11\n2026-04-21 13:13:15,6229,5654,3667,8965,11939,9892,4821,1719,2040,15135,84,26.08,45,45.103509,39.040526,11\n2026-04-21 13:13:30,6051,5419,3544,8767,11881,9562,5157,1658,2111,15224,131,25.97,46,45.102922,39.042211,12\n2026-04-21 13:13:45,6124,5717,3484,9014,11872,9587,4991,1718,2077,15191,117,25.91,45,45.103084,39.043071,13\n2026-04-21 13:14:00,6296,5492,3582,8962,11902,9603,4933,1671,2092,15177,108,26.10,46,45.101900,39.045876,13\n2026-04-21 13:14:15,6162,5451,3571,9002,12022,9575,5121,1762,2049,15147,80,26.18,47,45.101928,39.046389,12\n2026-04-21 13:14:30,5953,5365,3544,8818,12030,9538,5074,1728,2023,15137,123,25.87,44,45.102058,39.048520,11\n2026-04-21 13:14:45,6417,5625,3524,8551,11715,9774,5171,1666,2087,15125,81,26.07,44,45.100768,39.049642,13\n2026-04-21 13:15:00,6090,5648,3414,8891,11796,9652,5110,1581,2017,15194,82,25.71,44,45.101629,39.052494,11\n2026-04-21 13:15:15,6078,5564,3325,8792,11742,9302,4807,1590,2037,15186,131,25.79,45,45.101316,39.052863,12\n2026-04-21 13:15:30,6121,5560,3559,8742,11830,9404,5061,1668,2067,15221,122,25.57,47,45.100181,39.054788,12\n2026-04-21 13:15:45,6155,5560,3439,8964,11896,9507,5089,1715,1999,15265,84,25.80,46,45.100517,39.056471,12\n2026-04-21 13:16:00,6020,5495,3353,8552,11642,9504,5060,1552,1996,15250,114,25.82,43,45.099787,39.059268,12\n2026-04-21 13:16:15,6346,5391,3512,8418,12006,9231,5147,1685,2038,15195,119,25.74,45,45.099577,39.060053,10\n2026-04-21 13:16:30,6387,5431,3525,8590,11613,9290,5040,1598,2016,15183,84,25.82,44,45.098900,39.061310,13\n2026-04-21 13:16:45,5874,5351,3418,8771,11469,9175,5123,1676,2025,15141,93,25.79,43,45.098466,39.063910,10\n2026-04-21 13:17:00,5909,5270,3365,8533,11338,9352,5069,1658,1992,15157,106,25.51,47,45.098215,39.066180,12\n2026-04-21 13:17:15,5981,5244,3475,8455,11960,9058,4786,1508,2011,15142,121,25.39,44,45.097878,39.067762,12\n2026-04-21 13:17:30,6279,5480,3274,8487,11979,9077,5047,1624,2018,15223,72,25.57,45,45.097230,39.068587,10\n2026-04-21 13:17:45,6113,5268,3432,8583,11770,9067,4922,1654,1958,15225,109,25.40,45,45.096411,39.070738,11\n2026-04-21 13:18:00,6087,5549,3565,8573,11561,8946,4840,1608,2050,11473,127,25.49,44,45.096036,39.071356,13\n2026-04-21 13:18:15,6234,5392,3292,8656,11800,9102,4877,1525,1961,15151,102,25.28,46,45.095730,39.071345,11\n2026-04-21 13:18:30,5877,5271,3602,8677,11958,8924,4910,1662,1974,15138,113,25.15,45,45.094668,39.073125,12\n2026-04-21 13:18:45,6314,5338,3576,8593,11753,9520,5159,1615,2086,15191,82,25.18,44,45.092481,39.072847,12\n2026-04-21 13:19:00,5990,5399,3555,8710,11420,9095,5143,1537,2034,11333,138,25.43,45,45.093036,39.074705,13\n2026-04-21 13:19:15,6250,5637,3439,8603,11560,9554,5073,1633,2072,15263,131,25.22,46,45.090863,39.075356,12\n2026-04-21 13:19:30,6292,5333,3528,8691,11577,9051,4939,1615,2023,15239,137,25.23,45,45.091062,39.074999,12\n2026-04-21 13:19:45,6158,5624,3462,8782,11523,9195,4926,1654,2128,15252,89,25.30,46,45.089608,39.075864,11\n2026-04-21 13:20:00,6340,5443,3610,8625,12147,9214,5239,1575,2087,15225,138,25.25,45,45.088298,39.075869,13\n2026-04-21 13:20:15,6585,5666,3663,9139,11983,9133,5075,1681,2164,15127,158,25.16,44,45.087936,39.076093,12\n2026-04-21 13:20:30,6275,5602,3691,8748,11944,9307,5168,1729,2133,11375,92,25.17,46,45.085907,39.076918,10\n2026-04-21 13:20:45,6585,5412,3617,9091,11783,9143,5267,1694,2129,15187,128,25.04,47,45.085409,39.078963,10\n2026-04-21 13:21:00,6453,5667,3845,8826,11652,9417,5084,1684,2192,15191,117,25.16,44,45.084435,39.078349,11\n2026-04-21 13:21:15,6207,5659,3530,8718,12005,9409,5065,1662,2134,15138,112,24.77,48,45.084506,39.079567,11\n2026-04-21 13:21:30,6645,5615,3813,8991,11939,9233,5167,1706,2122,11374,118,24.70,48,45.082341,39.080752,10\n2026-04-21 13:21:45,6368,5431,3802,9192,12277,9214,5032,1687,2183,15253,132,24.90,46,45.082227,39.080112,12\n2026-04-21 13:22:00,6610,5531,3829,9191,11727,9268,5318,1718,2234,15174,131,24.76,48,45.080614,39.080775,12\n2026-04-21 13:22:15,6425,5659,3604,9177,12225,9743,5357,1650,2188,11444,139,24.79,47,45.080054,39.081903,11\n2026-04-21 13:22:30,6658,5793,3900,8962,11869,9447,5175,1732,2211,15182,149,24.55,48,45.079583,39.081314,11\n2026-04-21 13:22:45,6595,5624,3946,8905,12021,9464,5143,1716,2256,15224,137,24.72,48,45.078071,39.082866,10\n2026-04-21 13:23:00,6669,5741,3629,8970,12287,9256,5354,1728,2251,15233,111,24.55,48,45.077370,39.083481,11\n2026-04-21 13:23:15,6622,5576,3793,9291,12416,9453,5328,1694,2204,11400,136,24.81,47,45.076831,39.082669,13\n2026-04-21 13:23:30,6734,5535,3655,8924,12379,9700,5225,1697,2198,15220,140,24.61,45,45.076567,39.083791,12\n2026-04-21 13:23:45,6449,5577,3985,9018,11991,9739,5223,1633,2311,15173,156,24.54,48,45.074908,39.084545,12\n2026-04-21 13:24:00,6875,5674,3750,9332,11787,9695,5226,1754,2302,15212,137,24.56,47,45.074979,39.085112,12\n2026-04-21 13:24:15,6637,5716,3867,9002,12098,9383,5230,1757,2224,11396,127,24.30,46,45.073441,39.085349,12\n2026-04-21 13:24:30,6556,5589,3777,9273,12117,9280,5316,1757,2245,11347,179,24.23,46,45.074073,39.086248,11\n2026-04-21 13:24:45,6751,5791,3846,9189,12137,9710,5460,1733,2310,11334,170,24.13,46,45.073122,39.086125,10\n2026-04-21 13:25:00,6555,5721,3872,9484,11904,9266,5488,1772,2256,15224,148,24.18,47,45.071952,39.086547,11\n2026-04-21 13:25:15,6793,5669,3939,9327,12219,9385,5477,1677,2292,11428,178,24.44,47,45.070851,39.086891,11\n2026-04-21 13:25:30,6627,5834,3946,9431,12408,9342,5406,1644,2301,15185,130,24.39,46,45.070406,39.086722,10\n2026-04-21 13:25:45,6802,5723,3993,9041,11875,9695,5395,1641,2290,11351,141,24.35,46,45.070208,39.087358,11\n2026-04-21 13:26:00,6584,5712,3861,9086,11914,9328,5214,1748,2278,11438,170,24.36,49,45.068574,39.088680,12\n2026-04-21 13:26:15,6616,5731,3938,9174,12416,9351,5288,1769,2281,11352,175,24.29,46,45.067862,39.088957,13\n2026-04-21 13:26:30,7035,5785,3862,9144,12056,9391,5491,1739,2378,11445,161,23.99,45,45.067053,39.088020,11\n2026-04-21 13:26:45,6951,5727,4072,9501,12230,9602,5487,1775,2313,11455,133,24.06,48,45.066966,39.088238,11\n2026-04-21 13:27:00,7033,5635,3853,9405,12548,9529,5435,1695,2348,11331,180,24.00,46,45.065639,39.089840,11\n2026-04-21 13:27:15,6757,5823,3963,9514,12433,9524,5438,1672,2353,11464,175,24.06,48,45.065717,39.090574,10\n2026-04-21 13:27:30,7083,5553,4051,9537,11998,9237,5252,1772,2334,11379,124,23.96,46,45.064594,39.090638,13\n2026-04-21 13:27:45,6743,5796,3973,9112,12532,9610,5392,1726,2357,11433,146,23.70,46,45.063127,39.091072,11\n2026-04-21 13:28:00,6822,5861,4122,9199,12201,9748,5575,1712,2359,11395,167,23.94,47,45.063288,39.090529,10\n2026-04-21 13:28:15,6718,5682,4148,9301,12105,9762,5444,1724,2324,11375,141,23.94,49,45.062138,39.090974,13\n2026-04-21 13:28:30,6957,5951,4074,9532,12323,9474,5336,1754,2353,11370,130,23.64,46,45.060363,39.091075,11\n2026-04-21 13:28:45,6704,5674,4013,9442,12619,9303,5610,1758,2341,11430,143,23.68,49,45.060475,39.091626,12\n2026-04-21 13:29:00,6816,5696,3968,9486,12578,9571,5646,1698,2433,11355,202,23.83,49,45.059941,39.092036,13\n2026-04-21 13:29:15,6726,5754,3946,9392,12244,9339,5649,1675,2438,11364,129,23.43,49,45.057768,39.093052,12\n2026-04-21 13:29:30,7183,5659,4183,9678,12397,9404,5638,1785,2404,11451,186,23.44,50,45.057668,39.093238,10\n2026-04-21 13:29:45,6939,5889,4255,9353,12501,9378,5451,1664,2432,11429,155,23.56,47,45.057016,39.093915,10\n";

  // js/calibration.js
  function buildMqEntry(sensor) {
    const seed = DEFAULT_MQ_PRESET_POINTS[sensor];
    const base = {
      unit: seed.unit,
      point1: { ...seed.point1 },
      point2: { ...seed.point2 },
      slope: 0,
      offset: 0,
      powerOffThresholdRaw: DEFAULT_MQ_THRESHOLD,
      note: "\u041F\u0440\u0438\u043C\u0435\u0440, \u043D\u0435 \u0437\u0430\u0432\u043E\u0434\u0441\u043A\u0430\u044F \u043A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430"
    };
    return recomputeMqEntry(base);
  }
  function buildDefaultCalibrationPreset() {
    const mqSensors = {};
    for (const sensor of MQ_SENSORS) {
      mqSensors[sensor] = buildMqEntry(sensor);
    }
    return {
      version: 1,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      mqSensors,
      wind: {
        speed: {
          offsetRaw: 40,
          scaleMpsPerRaw: 0.01
        },
        directionAnchors: deepClone(DEFAULT_WIND_DIRECTION_ANCHORS)
      },
      uiDefaults: deepClone(DEFAULT_UI_DEFAULTS)
    };
  }
  function recomputeMqEntry(entry) {
    var _a, _b, _c, _d, _e;
    const point1Raw = safeNumber((_a = entry == null ? void 0 : entry.point1) == null ? void 0 : _a.raw);
    const point2Raw = safeNumber((_b = entry == null ? void 0 : entry.point2) == null ? void 0 : _b.raw);
    const point1Value = safeNumber((_c = entry == null ? void 0 : entry.point1) == null ? void 0 : _c.value);
    const point2Value = safeNumber((_d = entry == null ? void 0 : entry.point2) == null ? void 0 : _d.value);
    let slope = 0;
    let offset = 0;
    if (Number.isFinite(point1Raw) && Number.isFinite(point2Raw) && point1Raw !== point2Raw && Number.isFinite(point1Value) && Number.isFinite(point2Value)) {
      slope = (point2Value - point1Value) / (point2Raw - point1Raw);
      offset = point1Value - slope * point1Raw;
    }
    return {
      unit: (entry == null ? void 0 : entry.unit) || "",
      point1: {
        raw: point1Raw != null ? point1Raw : 0,
        value: point1Value != null ? point1Value : 0
      },
      point2: {
        raw: point2Raw != null ? point2Raw : 1,
        value: point2Value != null ? point2Value : 1
      },
      slope,
      offset,
      powerOffThresholdRaw: (_e = safeNumber(entry == null ? void 0 : entry.powerOffThresholdRaw)) != null ? _e : DEFAULT_MQ_THRESHOLD,
      note: (entry == null ? void 0 : entry.note) || ""
    };
  }
  function normalizeWind(presetWind) {
    var _a, _b, _c, _d;
    const offsetRaw = (_b = safeNumber((_a = presetWind == null ? void 0 : presetWind.speed) == null ? void 0 : _a.offsetRaw)) != null ? _b : 40;
    const scaleMpsPerRaw = (_d = safeNumber((_c = presetWind == null ? void 0 : presetWind.speed) == null ? void 0 : _c.scaleMpsPerRaw)) != null ? _d : 0.01;
    const directionAnchors = Array.isArray(presetWind == null ? void 0 : presetWind.directionAnchors) ? presetWind.directionAnchors.map((anchor) => {
      var _a2, _b2, _c2;
      return {
        raw: (_a2 = safeNumber(anchor.raw)) != null ? _a2 : 0,
        degrees: (_b2 = safeNumber(anchor.degrees)) != null ? _b2 : 0,
        label: String(anchor.label || "Unknown"),
        tolerance: (_c2 = safeNumber(anchor.tolerance)) != null ? _c2 : 1200
      };
    }).sort((left, right) => left.raw - right.raw) : deepClone(DEFAULT_WIND_DIRECTION_ANCHORS);
    return {
      speed: {
        offsetRaw,
        scaleMpsPerRaw
      },
      directionAnchors
    };
  }
  function normalizeCalibrationPreset(candidate) {
    var _a, _b, _c;
    const defaultPreset = buildDefaultCalibrationPreset();
    const preset = candidate && typeof candidate === "object" ? candidate : {};
    const mqSensors = {};
    for (const sensor of MQ_SENSORS) {
      mqSensors[sensor] = recomputeMqEntry({
        ...defaultPreset.mqSensors[sensor],
        ...((_a = preset.mqSensors) == null ? void 0 : _a[sensor]) || {}
      });
    }
    return {
      version: (_b = safeNumber(preset.version)) != null ? _b : defaultPreset.version,
      createdAt: preset.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
      mqSensors,
      wind: normalizeWind(preset.wind),
      uiDefaults: {
        ...deepClone(DEFAULT_UI_DEFAULTS),
        ...preset.uiDefaults || {},
        filters: {
          ...deepClone(DEFAULT_UI_DEFAULTS.filters),
          ...((_c = preset.uiDefaults) == null ? void 0 : _c.filters) || {}
        }
      }
    };
  }
  function serializeCalibrationPreset(calibration, uiDefaults) {
    return JSON.stringify(
      {
        ...normalizeCalibrationPreset(calibration),
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        uiDefaults: uiDefaults ? {
          ...deepClone(DEFAULT_UI_DEFAULTS),
          ...uiDefaults,
          filters: {
            ...deepClone(DEFAULT_UI_DEFAULTS.filters),
            ...uiDefaults.filters || {}
          }
        } : normalizeCalibrationPreset(calibration).uiDefaults
      },
      null,
      2
    );
  }
  function applyMqCalibration(sensor, rawValue, calibrationPreset) {
    var _a;
    const raw = safeNumber(rawValue);
    if (!Number.isFinite(raw)) {
      return null;
    }
    const entry = (_a = calibrationPreset == null ? void 0 : calibrationPreset.mqSensors) == null ? void 0 : _a[sensor];
    if (!entry) {
      return raw;
    }
    return Math.max(0, entry.slope * raw + entry.offset);
  }
  function isMqPowered(rawValue, calibrationEntry) {
    var _a;
    const raw = safeNumber(rawValue);
    if (!Number.isFinite(raw)) {
      return false;
    }
    const threshold = (_a = safeNumber(calibrationEntry == null ? void 0 : calibrationEntry.powerOffThresholdRaw)) != null ? _a : DEFAULT_MQ_THRESHOLD;
    return raw > threshold;
  }
  function getMqUnpoweredSensors(row, calibrationPreset) {
    var _a;
    const suspects = [];
    for (const sensor of MQ_SENSORS) {
      const entry = (_a = calibrationPreset == null ? void 0 : calibrationPreset.mqSensors) == null ? void 0 : _a[sensor];
      if (!isMqPowered(row.values[sensor], entry)) {
        suspects.push(sensor);
      }
    }
    return suspects;
  }
  function applyWindSpeed(rawValue, calibrationPreset) {
    var _a, _b, _c, _d, _e, _f;
    const raw = safeNumber(rawValue);
    if (!Number.isFinite(raw)) {
      return null;
    }
    const offsetRaw = (_c = safeNumber((_b = (_a = calibrationPreset == null ? void 0 : calibrationPreset.wind) == null ? void 0 : _a.speed) == null ? void 0 : _b.offsetRaw)) != null ? _c : 40;
    const scaleMpsPerRaw = (_f = safeNumber((_e = (_d = calibrationPreset == null ? void 0 : calibrationPreset.wind) == null ? void 0 : _d.speed) == null ? void 0 : _e.scaleMpsPerRaw)) != null ? _f : 0.01;
    return Math.max(0, (raw - offsetRaw) * scaleMpsPerRaw);
  }
  function applyWindDirection(rawValue, calibrationPreset) {
    var _a, _b;
    const raw = safeNumber(rawValue);
    if (!Number.isFinite(raw)) {
      return {
        raw: null,
        degrees: null,
        label: "Unknown",
        delta: null
      };
    }
    const anchors = ((_a = calibrationPreset == null ? void 0 : calibrationPreset.wind) == null ? void 0 : _a.directionAnchors) || [];
    if (!anchors.length) {
      return {
        raw,
        degrees: null,
        label: "Unknown",
        delta: null
      };
    }
    let closest = null;
    for (const anchor of anchors) {
      const delta = Math.abs(raw - anchor.raw);
      if (!closest || delta < closest.delta) {
        closest = { ...anchor, delta };
      }
    }
    if (!closest || closest.delta > closest.tolerance) {
      return {
        raw,
        degrees: null,
        label: "Unknown",
        delta: (_b = closest == null ? void 0 : closest.delta) != null ? _b : null
      };
    }
    return {
      raw,
      degrees: closest.degrees,
      label: closest.label,
      delta: closest.delta
    };
  }
  function buildCalibrationSnapshot(calibrationPreset, uiDefaults) {
    return {
      ...normalizeCalibrationPreset(calibrationPreset),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      uiDefaults: uiDefaults ? deepClone(uiDefaults) : deepClone(DEFAULT_UI_DEFAULTS)
    };
  }
  function roundCalibrationEntry(entry) {
    const normalized = recomputeMqEntry(entry);
    return {
      ...normalized,
      slope: round(normalized.slope, 8),
      offset: round(normalized.offset, 4)
    };
  }

  // js/data.js
  var GPS_SATELLITE_ALIASES = [
    "satellites",
    "gpssatellites",
    "gps_sats",
    "gpssats",
    "sats",
    "gpssat",
    "satcount"
  ];
  function normalizeColumnName(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }
  function detectSatelliteColumn(extraColumns) {
    return extraColumns.find(
      (column) => GPS_SATELLITE_ALIASES.includes(normalizeColumnName(column))
    ) || null;
  }
  function parseNumericField(column, value) {
    const numeric = safeNumber(value);
    if (!Number.isFinite(numeric)) {
      return null;
    }
    if (column === "Hum" && numeric < 0) {
      return null;
    }
    if ((column === "WindDirRaw" || column === "WindSpeedRaw") && numeric < 0) {
      return null;
    }
    return numeric;
  }
  function detectExtraColumns(fields) {
    return fields.filter((field) => !REQUIRED_COLUMNS.includes(field));
  }
  function isRowEmpty(row) {
    return Object.values(row).every(
      (value) => value === null || value === void 0 || String(value).trim() === ""
    );
  }
  function buildRow(sourceRow, index, extraColumns) {
    const timestamp = parseDeviceDateTime(sourceRow.datetime);
    const values = {};
    for (const column of REQUIRED_COLUMNS.filter((column2) => column2 !== "datetime")) {
      values[column] = parseNumericField(column, sourceRow[column]);
    }
    const extras = {};
    for (const column of extraColumns) {
      extras[column] = parseNumericField(column, sourceRow[column]);
    }
    const lat = values.Lat;
    const lon = values.Lon;
    const gpsStatus = !Number.isFinite(lat) || !Number.isFinite(lon) ? "missing" : Math.abs(lat) < 1 || Math.abs(lon) < 1 ? "suspicious" : "valid";
    const hasWeather = Number.isFinite(values.TempC) && Number.isFinite(values.Hum);
    return {
      id: index + 1,
      rowNumber: index + 2,
      timestamp,
      datetimeText: sourceRow.datetime || "",
      values,
      extras,
      derived: {
        dewPoint: hasWeather ? computeDewPoint(values.TempC, values.Hum) : null
      },
      flags: {
        gpsStatus,
        hasWeather,
        gpsJump: false,
        trackBreakBefore: gpsStatus !== "valid"
      },
      sessionId: "session-1"
    };
  }
  function buildSessions(rows) {
    const sessions = [];
    let currentId = 1;
    let currentSession = null;
    let previousTimestamp = null;
    for (const row of rows) {
      const gapMs = previousTimestamp && row.timestamp ? row.timestamp.getTime() - previousTimestamp.getTime() : 0;
      if (!currentSession || !row.timestamp || gapMs > SESSION_GAP_MS) {
        currentSession = {
          id: `session-${currentId}`,
          index: currentId,
          start: row.timestamp,
          end: row.timestamp,
          count: 0
        };
        sessions.push(currentSession);
        currentId += 1;
      }
      row.sessionId = currentSession.id;
      currentSession.count += 1;
      currentSession.end = row.timestamp || currentSession.end;
      previousTimestamp = row.timestamp || previousTimestamp;
    }
    for (const session of sessions) {
      session.label = `\u0421\u0435\u0441\u0441\u0438\u044F ${session.index}`;
      session.subtitle = `${formatDateTime(session.start)} \xB7 ${session.count} \u0441\u0442\u0440\u043E\u043A`;
      session.durationText = session.start && session.end ? formatDurationMs(session.end.getTime() - session.start.getTime()) : "\u2014";
    }
    return sessions;
  }
  function annotateTrackBreaks(rows) {
    let previousValidGpsRow = null;
    for (const row of rows) {
      if (row.flags.gpsStatus !== "valid" || !row.timestamp) {
        row.flags.trackBreakBefore = true;
        continue;
      }
      if (!previousValidGpsRow) {
        row.flags.trackBreakBefore = true;
        previousValidGpsRow = row;
        continue;
      }
      const distanceKm = haversineKm(
        previousValidGpsRow.values.Lat,
        previousValidGpsRow.values.Lon,
        row.values.Lat,
        row.values.Lon
      );
      const timeHours = (row.timestamp.getTime() - previousValidGpsRow.timestamp.getTime()) / (1e3 * 60 * 60);
      const speedKmh = timeHours > 0 ? distanceKm / timeHours : null;
      if (Number.isFinite(speedKmh) && speedKmh > GPS_JUMP_SPEED_KMH) {
        row.flags.gpsJump = true;
        row.flags.trackBreakBefore = true;
      } else {
        row.flags.trackBreakBefore = false;
      }
      previousValidGpsRow = row;
    }
  }
  function parseCsvText(text) {
    var _a, _b, _c;
    const parsed = window.Papa.parse(text, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (header) => String(header || "").trim()
    });
    if ((_a = parsed.errors) == null ? void 0 : _a.length) {
      const blockingError = parsed.errors.find((error) => error.code !== "UndetectableDelimiter");
      if (blockingError) {
        throw new Error(`CSV parse error: ${blockingError.message}`);
      }
    }
    const fields = parsed.meta.fields || [];
    const missing = REQUIRED_COLUMNS.filter((column) => !fields.includes(column));
    if (missing.length) {
      throw new Error(`\u0412 CSV \u043D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0445 \u043A\u043E\u043B\u043E\u043D\u043E\u043A: ${missing.join(", ")}`);
    }
    const extraColumns = detectExtraColumns(fields);
    const satelliteColumn = detectSatelliteColumn(extraColumns);
    const rows = parsed.data.filter((row) => !isRowEmpty(row)).map((row, index) => buildRow(row, index, extraColumns)).filter((row) => row.timestamp instanceof Date && !Number.isNaN(row.timestamp.getTime()));
    const sessions = buildSessions(rows);
    annotateTrackBreaks(rows);
    const calendarStart = ((_b = rows[0]) == null ? void 0 : _b.timestamp) || null;
    const calendarEnd = ((_c = rows[rows.length - 1]) == null ? void 0 : _c.timestamp) || null;
    const activeDurationMs = sessions.reduce((sum, session) => {
      if (!session.start || !session.end) {
        return sum;
      }
      return sum + Math.max(0, session.end.getTime() - session.start.getTime());
    }, 0);
    return {
      rows,
      sessions,
      fields,
      extraColumns,
      numericExtraColumns: extraColumns.filter(
        (column) => rows.some((row) => Number.isFinite(row.extras[column]))
      ),
      satelliteColumn,
      calendarStart,
      calendarEnd,
      calendarSpanMs: calendarStart && calendarEnd ? Math.max(0, calendarEnd.getTime() - calendarStart.getTime()) : 0,
      activeDurationMs,
      totalRows: rows.length
    };
  }
  function buildMqMetricMeta(sensor, calibrationPreset) {
    var _a, _b;
    const unit = ((_b = (_a = calibrationPreset == null ? void 0 : calibrationPreset.mqSensors) == null ? void 0 : _a[sensor]) == null ? void 0 : _b.unit) || "ppm";
    return {
      key: sensor,
      label: sensor,
      target: MQ_SENSOR_TARGETS[sensor] || "",
      unit,
      category: "mq",
      supportsMode: true
    };
  }
  function buildMetricCatalog(extraColumns, calibrationPreset) {
    const mqMetrics = MQ_SENSORS.map(
      (sensor) => buildMqMetricMeta(sensor, calibrationPreset)
    );
    const extraMetrics = extraColumns.map((column) => ({
      key: column,
      label: `${column} (extra)`,
      unit: "",
      category: "extra",
      supportsMode: false
    }));
    return [...mqMetrics, ...METRIC_DEFINITIONS, ...extraMetrics];
  }
  function getMetricMeta(metricCatalog, metricKey) {
    return metricCatalog.find((metric) => metric.key === metricKey) || null;
  }
  function getMetricValue(row, metricKey, calibrationPreset, mode = "raw") {
    if (!row) {
      return null;
    }
    if (MQ_SENSORS.includes(metricKey)) {
      const raw = row.values[metricKey];
      return mode === "calibrated" ? applyMqCalibration(metricKey, raw, calibrationPreset) : raw;
    }
    if (metricKey === "WindSpeedMps") {
      return applyWindSpeed(row.values.WindSpeedRaw, calibrationPreset);
    }
    if (metricKey === "WindDirDegrees") {
      return applyWindDirection(row.values.WindDirRaw, calibrationPreset).degrees;
    }
    if (metricKey === "DewPoint") {
      return row.derived.dewPoint;
    }
    if (Object.prototype.hasOwnProperty.call(row.values, metricKey)) {
      return row.values[metricKey];
    }
    if (Object.prototype.hasOwnProperty.call(row.extras, metricKey)) {
      return row.extras[metricKey];
    }
    return null;
  }
  function getMetricUnit(metricMeta, mode, calibrationPreset) {
    var _a, _b;
    if (!metricMeta) {
      return "";
    }
    if (metricMeta.category === "mq") {
      return mode === "calibrated" ? ((_b = (_a = calibrationPreset == null ? void 0 : calibrationPreset.mqSensors) == null ? void 0 : _a[metricMeta.key]) == null ? void 0 : _b.unit) || metricMeta.unit || "ppm" : "ADC";
    }
    return metricMeta.unit || "";
  }
  function matchesViewport(row, viewportBounds) {
    if (!viewportBounds) {
      return true;
    }
    const lat = row.values.Lat;
    const lon = row.values.Lon;
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return false;
    }
    return lat >= viewportBounds.south && lat <= viewportBounds.north && lon >= viewportBounds.west && lon <= viewportBounds.east;
  }
  function matchesDateRange(row, filters) {
    if (!(row.timestamp instanceof Date) || Number.isNaN(row.timestamp.getTime())) {
      return false;
    }
    const from = parseDateTimeLocal(filters.from);
    const to = parseDateTimeLocal(filters.to);
    if (from && row.timestamp < from) {
      return false;
    }
    const inclusiveTo = to ? new Date(to.getTime() + 59999) : null;
    if (inclusiveTo && row.timestamp > inclusiveTo) {
      return false;
    }
    return true;
  }
  function matchesValueRange(row, filters, calibrationPreset) {
    const value = getMetricValue(row, filters.metric, calibrationPreset, filters.mode);
    const min = safeNumber(filters.metricMin);
    const max = safeNumber(filters.metricMax);
    if (Number.isFinite(min) && (!Number.isFinite(value) || value < min)) {
      return false;
    }
    if (Number.isFinite(max) && (!Number.isFinite(value) || value > max)) {
      return false;
    }
    return true;
  }
  function buildCoverageStats(rows, filteredRows, calibrationPreset, satelliteColumn = null) {
    const gpsPresent = rows.filter(
      (row) => Number.isFinite(row.values.Lat) && Number.isFinite(row.values.Lon)
    ).length;
    const gpsValid = rows.filter((row) => row.flags.gpsStatus === "valid").length;
    const gpsSuspicious = rows.filter((row) => row.flags.gpsStatus === "suspicious").length;
    const weatherCount = rows.filter((row) => row.flags.hasWeather).length;
    const mqOffRows = rows.filter(
      (row) => getMqUnpoweredSensors(row, calibrationPreset).length > 0
    ).length;
    const satelliteValues = satelliteColumn ? rows.map((row) => row.extras[satelliteColumn]).filter((value) => Number.isFinite(value)) : [];
    return {
      scopedRows: rows.length,
      visibleRows: filteredRows.length,
      gpsPresent,
      gpsValid,
      gpsSuspicious,
      weatherCount,
      mqOffRows,
      satelliteColumn,
      satellitesAvailable: satelliteValues.length > 0,
      satellitesAvg: satelliteValues.length ? satelliteValues.reduce((sum, value) => sum + value, 0) / satelliteValues.length : null,
      satellitesMin: satelliteValues.length ? Math.min(...satelliteValues) : null,
      satellitesMax: satelliteValues.length ? Math.max(...satelliteValues) : null
    };
  }
  function buildAnomalies(rows, calibrationPreset, limit = 40) {
    var _a, _b;
    const anomalies = [];
    for (const row of rows) {
      if (row.flags.gpsStatus === "missing") {
        anomalies.push({
          rowId: row.id,
          type: "GPS \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442",
          timestamp: row.timestamp,
          detail: "\u041A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0442\u044B \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044E\u0442 \u0432 \u0441\u0442\u0440\u043E\u043A\u0435"
        });
      }
      if (row.flags.gpsStatus === "suspicious") {
        anomalies.push({
          rowId: row.id,
          type: "\u041F\u043E\u0434\u043E\u0437\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 GPS",
          timestamp: row.timestamp,
          detail: `Lat=${(_a = row.values.Lat) != null ? _a : "\u2014"}, Lon=${(_b = row.values.Lon) != null ? _b : "\u2014"}`
        });
      }
      if (row.flags.gpsJump) {
        anomalies.push({
          rowId: row.id,
          type: "\u0420\u0430\u0437\u0440\u044B\u0432 \u0442\u0440\u0435\u043A\u0430",
          timestamp: row.timestamp,
          detail: `\u0421\u043A\u0430\u0447\u043E\u043A > ${GPS_JUMP_SPEED_KMH} \u043A\u043C/\u0447, \u0441\u0435\u0433\u043C\u0435\u043D\u0442 \u043F\u043E\u0440\u0432\u0430\u043D`
        });
      }
      if (!row.flags.hasWeather) {
        anomalies.push({
          rowId: row.id,
          type: "\u041D\u0435\u0442 \u043F\u043E\u0433\u043E\u0434\u044B",
          timestamp: row.timestamp,
          detail: "\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430 \u0438\u043B\u0438 \u0432\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044E\u0442"
        });
      }
      const mqOffSensors = getMqUnpoweredSensors(row, calibrationPreset);
      if (mqOffSensors.length) {
        anomalies.push({
          rowId: row.id,
          type: "MQ \u0431\u0435\u0437 \u043F\u0438\u0442\u0430\u043D\u0438\u044F",
          timestamp: row.timestamp,
          detail: mqOffSensors.join(", ")
        });
      }
    }
    return anomalies.slice(0, limit);
  }
  function evaluateDataset(dataset, filters, calibrationPreset, viewportBounds) {
    var _a;
    if (!((_a = dataset == null ? void 0 : dataset.rows) == null ? void 0 : _a.length)) {
      return {
        scopedRows: [],
        filteredRows: [],
        gpsRows: [],
        coverage: buildCoverageStats([], [], calibrationPreset),
        anomalies: [],
        metricRange: { min: null, max: null }
      };
    }
    const scopedRows = dataset.rows.filter((row) => {
      if (filters.sessionId !== "all" && row.sessionId !== filters.sessionId) {
        return false;
      }
      return matchesDateRange(row, filters);
    });
    const filteredRows = scopedRows.filter((row) => {
      if (filters.onlyGps && row.flags.gpsStatus !== "valid") {
        return false;
      }
      if (filters.onlyWeather && !row.flags.hasWeather) {
        return false;
      }
      if (filters.hideSuspiciousGps && row.flags.gpsStatus !== "valid") {
        return false;
      }
      if (filters.hideMqOff && getMqUnpoweredSensors(row, calibrationPreset).length > 0 && MQ_SENSORS.includes(filters.metric)) {
        return false;
      }
      if (filters.filterByViewport && !matchesViewport(row, viewportBounds)) {
        return false;
      }
      return matchesValueRange(row, filters, calibrationPreset);
    });
    const metricValues = filteredRows.map((row) => getMetricValue(row, filters.metric, calibrationPreset, filters.mode)).filter((value) => Number.isFinite(value));
    const gpsRows = filteredRows.filter((row) => row.flags.gpsStatus === "valid");
    const mappedRows = filteredRows.filter(
      (row) => Number.isFinite(row.values.Lat) && Number.isFinite(row.values.Lon)
    );
    return {
      scopedRows,
      filteredRows,
      gpsRows,
      mappedRows,
      coverage: buildCoverageStats(
        scopedRows,
        filteredRows,
        calibrationPreset,
        dataset.satelliteColumn
      ),
      anomalies: buildAnomalies(scopedRows, calibrationPreset),
      metricRange: {
        min: metricValues.length ? Math.min(...metricValues) : null,
        max: metricValues.length ? Math.max(...metricValues) : null
      }
    };
  }
  function buildExportRows(rows, calibrationPreset, extraColumns) {
    return rows.map((row) => {
      const exportRow = {
        datetime: row.datetimeText,
        sessionId: row.sessionId,
        gpsStatus: row.flags.gpsStatus,
        gpsJump: row.flags.gpsJump,
        hasWeather: row.flags.hasWeather,
        WindSpeedMps: applyWindSpeed(row.values.WindSpeedRaw, calibrationPreset),
        WindDirDegrees: applyWindDirection(row.values.WindDirRaw, calibrationPreset).degrees,
        WindDirLabel: applyWindDirection(row.values.WindDirRaw, calibrationPreset).label,
        DewPoint: row.derived.dewPoint
      };
      for (const column of REQUIRED_COLUMNS.filter((column2) => column2 !== "datetime")) {
        exportRow[column] = row.values[column];
      }
      for (const sensor of MQ_SENSORS) {
        exportRow[`${sensor}_calibrated`] = applyMqCalibration(
          sensor,
          row.values[sensor],
          calibrationPreset
        );
        exportRow[`${sensor}_mqOff`] = getMqUnpoweredSensors(row, calibrationPreset).includes(
          sensor
        );
      }
      for (const column of extraColumns) {
        exportRow[column] = row.extras[column];
      }
      return exportRow;
    });
  }
  function getSessionBounds(dataset, sessionId) {
    var _a;
    if (!((_a = dataset == null ? void 0 : dataset.rows) == null ? void 0 : _a.length)) {
      return { from: "", to: "" };
    }
    const rows = sessionId === "all" ? dataset.rows : dataset.rows.filter((row) => row.sessionId === sessionId);
    if (!rows.length) {
      return { from: "", to: "" };
    }
    const from = rows[0].timestamp;
    const to = rows[rows.length - 1].timestamp;
    const pad = (value) => String(value).padStart(2, "0");
    const toLocalInput = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
      date.getHours()
    )}:${pad(date.getMinutes())}`;
    return {
      from: toLocalInput(from),
      to: toLocalInput(to)
    };
  }
  function buildHeatmapMetricList(metricCatalog) {
    return DEFAULT_HEATMAP_METRICS.filter(
      (metricKey) => metricCatalog.some((metric) => metric.key === metricKey)
    );
  }

  // js/map.js
  var IdwCanvasLayer = class extends L.Layer {
    constructor(options = {}) {
      super(options);
      this.options = {
        pane: "overlayPane",
        blockSize: 14,
        radius: 180,
        power: 1.4,
        opacity: 0.42,
        ...options
      };
      this._points = [];
      this._colorScale = () => MAP_GRADIENT[0];
    }
    onAdd(map) {
      this._map = map;
      this._canvas = L.DomUtil.create("canvas", "leaflet-idw-layer");
      this._canvas.style.position = "absolute";
      this._canvas.style.pointerEvents = "none";
      map.getPanes().overlayPane.appendChild(this._canvas);
      map.on("moveend zoomend resize", this._reset, this);
      this._reset();
    }
    onRemove(map) {
      map.off("moveend zoomend resize", this._reset, this);
      if (this._canvas) {
        this._canvas.remove();
      }
    }
    setData(points, colorScale) {
      this._points = points || [];
      this._colorScale = colorScale || (() => MAP_GRADIENT[0]);
      this.redraw();
    }
    redraw() {
      if (!this._map || !this._canvas) {
        return;
      }
      cancelAnimationFrame(this._frameId);
      this._frameId = requestAnimationFrame(() => this._draw());
    }
    _reset() {
      if (!this._map || !this._canvas) {
        return;
      }
      const size = this._map.getSize();
      const topLeft = this._map.containerPointToLayerPoint([0, 0]);
      L.DomUtil.setPosition(this._canvas, topLeft);
      this._canvas.width = size.x;
      this._canvas.height = size.y;
      this.redraw();
    }
    _draw() {
      const canvas = this._canvas;
      const map = this._map;
      if (!canvas || !map) {
        return;
      }
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (!this._points.length) {
        return;
      }
      const radius = this.options.radius;
      const radiusSq = radius * radius;
      const blockSize = this.options.blockSize;
      const projected = this._points.map((point) => {
        const layerPoint = map.latLngToContainerPoint([point.lat, point.lon]);
        return {
          x: layerPoint.x,
          y: layerPoint.y,
          value: point.value
        };
      });
      for (let y = 0; y < canvas.height; y += blockSize) {
        for (let x = 0; x < canvas.width; x += blockSize) {
          let weightedSum = 0;
          let weightTotal = 0;
          for (const point of projected) {
            const dx = x - point.x;
            const dy = y - point.y;
            const distanceSq = dx * dx + dy * dy;
            if (distanceSq > radiusSq) {
              continue;
            }
            const weight = 1 / Math.pow(distanceSq + 24, this.options.power / 2);
            weightedSum += point.value * weight;
            weightTotal += weight;
          }
          if (!weightTotal) {
            continue;
          }
          const interpolated = weightedSum / weightTotal;
          const alpha = Math.min(this.options.opacity, 0.12 + weightTotal * 0.035);
          context.fillStyle = this._hexToRgba(this._colorScale(interpolated), alpha);
          context.fillRect(x, y, blockSize, blockSize);
        }
      }
    }
    _hexToRgba(hexColor, alpha) {
      const clean = hexColor.replace("#", "");
      const r = Number.parseInt(clean.slice(0, 2), 16);
      const g = Number.parseInt(clean.slice(2, 4), 16);
      const b = Number.parseInt(clean.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  };
  function buildTooltip(row, metricLabel, metricValue, metricUnit) {
    return `
    <div class="map-tooltip">
      <strong>${row.datetimeText}</strong><br>
      <span>${metricLabel}: ${formatNumber(metricValue, 2)} ${metricUnit || ""}</span><br>
      <span>Lat: ${formatNumber(row.values.Lat, 6)}</span><br>
      <span>Lon: ${formatNumber(row.values.Lon, 6)}</span>
    </div>
  `;
  }
  function toViewportBounds(leafletBounds) {
    return {
      south: leafletBounds.getSouth(),
      north: leafletBounds.getNorth(),
      west: leafletBounds.getWest(),
      east: leafletBounds.getEast()
    };
  }
  function createMapController({
    container,
    onViewportChange,
    onRowSelect
  }) {
    const map = L.map(container, {
      attributionControl: false,
      zoomControl: false,
      preferCanvas: true
    }).setView([55.75, 37.61], 5);
    L.control.zoom({ position: "topright" }).addTo(map);
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20
      }
    ).addTo(map);
    const baseTrackLayer = L.layerGroup().addTo(map);
    const coloredSegmentsLayer = L.layerGroup().addTo(map);
    const pointsLayer = L.layerGroup().addTo(map);
    const selectionLayer = L.layerGroup().addTo(map);
    const idwLayer = new IdwCanvasLayer();
    idwLayer.addTo(map);
    let hasFitBounds = false;
    const emitViewport = () => {
      if (typeof onViewportChange === "function") {
        onViewportChange(toViewportBounds(map.getBounds()));
      }
    };
    map.on("moveend", emitViewport);
    emitViewport();
    return {
      map,
      resize() {
        map.invalidateSize();
      },
      update({
        mappedRows,
        activeMetricLabel,
        activeMetricUnit,
        getRowMetricValue: getRowMetricValue2,
        selectedRowId,
        showIdw,
        fitToRows = false
      }) {
        baseTrackLayer.clearLayers();
        coloredSegmentsLayer.clearLayers();
        pointsLayer.clearLayers();
        selectionLayer.clearLayers();
        const metricValues = mappedRows.map((row) => getRowMetricValue2(row)).filter((value) => Number.isFinite(value));
        const min = metricValues.length ? Math.min(...metricValues) : null;
        const max = metricValues.length ? Math.max(...metricValues) : null;
        const colorScale = createColorScale(MAP_GRADIENT, min, max);
        const idwPoints = [];
        let previousValid = null;
        const bounds = [];
        for (const row of mappedRows) {
          const lat = row.values.Lat;
          const lon = row.values.Lon;
          if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
            continue;
          }
          bounds.push([lat, lon]);
          const metricValue = getRowMetricValue2(row);
          const isSuspicious = row.flags.gpsStatus !== "valid";
          if (row.flags.gpsStatus === "valid" && Number.isFinite(metricValue)) {
            idwPoints.push({ lat, lon, value: metricValue });
          }
          const pointColor = Number.isFinite(metricValue) ? colorScale(metricValue) : isSuspicious ? "#d95a4e" : "#7c5f86";
          const circle = L.circleMarker([lat, lon], {
            radius: row.id === selectedRowId ? 8 : isSuspicious ? 5 : 4.5,
            weight: row.id === selectedRowId ? 2.5 : 1.4,
            color: row.id === selectedRowId ? "#15384f" : "#ffffff",
            fillColor: pointColor,
            fillOpacity: isSuspicious ? 0.55 : 0.9,
            opacity: 1,
            dashArray: isSuspicious ? "3 3" : null
          });
          circle.bindTooltip(
            buildTooltip(row, activeMetricLabel, metricValue, activeMetricUnit),
            {
              sticky: true,
              direction: "top"
            }
          );
          circle.on("click", () => onRowSelect == null ? void 0 : onRowSelect(row.id));
          circle.addTo(pointsLayer);
          if (previousValid && previousValid.flags.gpsStatus === "valid" && row.flags.gpsStatus === "valid" && !row.flags.trackBreakBefore) {
            L.polyline(
              [
                [previousValid.values.Lat, previousValid.values.Lon],
                [lat, lon]
              ],
              {
                color: "#bed4d3",
                weight: 7,
                opacity: 0.2
              }
            ).addTo(baseTrackLayer);
            L.polyline(
              [
                [previousValid.values.Lat, previousValid.values.Lon],
                [lat, lon]
              ],
              {
                color: Number.isFinite(metricValue) ? colorScale(metricValue) : "#7c5f86",
                weight: 4,
                opacity: 0.92,
                lineJoin: "round"
              }
            ).bindTooltip(
              `${formatDateTime(row.timestamp)}<br>${activeMetricLabel}: ${formatNumber(
                metricValue,
                2
              )} ${activeMetricUnit || ""}`
            ).on("click", () => onRowSelect == null ? void 0 : onRowSelect(row.id)).addTo(coloredSegmentsLayer);
          }
          if (row.flags.gpsStatus === "valid") {
            previousValid = row;
          } else {
            previousValid = null;
          }
        }
        idwLayer.setData(showIdw ? idwPoints : [], colorScale);
        if (selectedRowId) {
          const selectedRow = mappedRows.find((row) => row.id === selectedRowId);
          if (selectedRow && Number.isFinite(selectedRow.values.Lat) && Number.isFinite(selectedRow.values.Lon)) {
            L.circleMarker([selectedRow.values.Lat, selectedRow.values.Lon], {
              radius: 14,
              weight: 2,
              color: "#163748",
              fillColor: "#ffffff",
              fillOpacity: 0.14
            }).addTo(selectionLayer);
          }
        }
        if (bounds.length && (fitToRows || !hasFitBounds)) {
          map.fitBounds(bounds, {
            padding: [24, 24],
            maxZoom: 15
          });
          hasFitBounds = true;
        }
      }
    };
  }

  // js/main.js
  var dom = {
    csvFileInput: document.getElementById("csv-file-input"),
    presetFileInput: document.getElementById("preset-file-input"),
    loadFilesBtn: document.getElementById("load-files-btn"),
    loadDemoBtn: document.getElementById("load-demo-btn"),
    importStatus: document.getElementById("import-status"),
    datasetMeta: document.getElementById("dataset-meta"),
    sessionSelect: document.getElementById("session-select"),
    fromInput: document.getElementById("from-input"),
    toInput: document.getElementById("to-input"),
    metricSelect: document.getElementById("metric-select"),
    modeSelect: document.getElementById("mode-select"),
    metricMinInput: document.getElementById("metric-min-input"),
    metricMaxInput: document.getElementById("metric-max-input"),
    onlyGpsToggle: document.getElementById("only-gps-toggle"),
    onlyWeatherToggle: document.getElementById("only-weather-toggle"),
    hideSuspiciousToggle: document.getElementById("hide-suspicious-toggle"),
    hideMqOffToggle: document.getElementById("hide-mq-off-toggle"),
    viewportToggle: document.getElementById("viewport-toggle"),
    idwToggle: document.getElementById("idw-toggle"),
    kpiGrid: document.getElementById("kpi-grid"),
    metricLegendLabel: document.getElementById("metric-legend-label"),
    metricLegendValues: document.getElementById("metric-legend-values"),
    selectedRowCard: document.getElementById("selected-row-card"),
    coverageCard: document.getElementById("coverage-card"),
    timelineMetrics: document.getElementById("timeline-metrics"),
    scatterX: document.getElementById("scatter-x"),
    scatterY: document.getElementById("scatter-y"),
    mqCalibrationBody: document.getElementById("mq-calibration-body"),
    windSpeedOffset: document.getElementById("wind-speed-offset"),
    windSpeedScale: document.getElementById("wind-speed-scale"),
    windAnchorBody: document.getElementById("wind-anchor-body"),
    addWindAnchorBtn: document.getElementById("add-wind-anchor-btn"),
    saveCalibrationBtn: document.getElementById("save-calibration-btn"),
    loadCalibrationBtn: document.getElementById("load-calibration-btn"),
    anomalyBody: document.getElementById("anomaly-body"),
    exportCsvBtn: document.getElementById("export-csv-btn"),
    resetFiltersBtn: document.getElementById("reset-filters-btn"),
    exportSummary: document.getElementById("export-summary"),
    timelineChart: document.getElementById("timeline-chart"),
    scatterChart: document.getElementById("scatter-chart"),
    map: document.getElementById("map")
  };
  var state = {
    dataset: null,
    calibration: buildDefaultCalibrationPreset(),
    metricCatalog: buildMetricCatalog([], buildDefaultCalibrationPreset()),
    filters: { ...DEFAULT_UI_FILTERS },
    viewportBounds: null,
    evaluation: null,
    selectedRowId: null,
    timelineMetrics: [...DEFAULT_UI_DEFAULTS.timelineMetrics],
    scatterX: DEFAULT_UI_DEFAULTS.scatterX,
    scatterY: DEFAULT_UI_DEFAULTS.scatterY,
    pendingPresetLoadOnly: false
  };
  var mapController = createMapController({
    container: dom.map,
    onViewportChange(bounds) {
      state.viewportBounds = bounds;
      if (state.filters.filterByViewport && state.dataset) {
        renderAll(false);
      }
    },
    onRowSelect(rowId) {
      state.selectedRowId = rowId;
      renderAll(false);
    }
  });
  var charts = createCharts({
    timelineEl: dom.timelineChart,
    heatmapEl: document.getElementById("heatmap-chart"),
    scatterEl: dom.scatterChart,
    weatherEl: document.getElementById("weather-chart"),
    onRowSelect(rowId) {
      state.selectedRowId = rowId;
      renderAll(false);
    }
  });
  function setStatus(message, tone = "default") {
    if (!dom.importStatus) {
      return;
    }
    dom.importStatus.textContent = message;
    dom.importStatus.style.color = tone === "danger" ? "#c43c31" : tone === "success" ? "#1f8f55" : tone === "warning" ? "#a56500" : "";
  }
  async function readFileText(file) {
    return file ? file.text() : null;
  }
  function mergeUiDefaults(uiDefaults) {
    return {
      ...DEFAULT_UI_DEFAULTS,
      ...uiDefaults || {},
      filters: {
        ...DEFAULT_UI_FILTERS,
        ...(uiDefaults == null ? void 0 : uiDefaults.filters) || {}
      }
    };
  }
  function refreshMetricCatalog() {
    var _a;
    const extraColumns = ((_a = state.dataset) == null ? void 0 : _a.numericExtraColumns) || [];
    state.metricCatalog = buildMetricCatalog(extraColumns, state.calibration);
    const metricKeys = state.metricCatalog.map((metric) => metric.key);
    if (!metricKeys.includes(state.filters.metric)) {
      state.filters.metric = metricKeys.includes("MQ-135") ? "MQ-135" : metricKeys[0];
    }
    state.timelineMetrics = state.timelineMetrics.filter((metric) => metricKeys.includes(metric));
    if (!state.timelineMetrics.length && metricKeys.length) {
      state.timelineMetrics = metricKeys.includes("MQ-135") ? ["MQ-135"] : [metricKeys[0]];
    }
    if (!metricKeys.includes(state.scatterX)) {
      state.scatterX = state.filters.metric;
    }
    if (!metricKeys.includes(state.scatterY)) {
      state.scatterY = metricKeys.includes("TempC") ? "TempC" : metricKeys[0];
    }
  }
  function populateSelect(select, options, selectedValue, { multiple = false } = {}) {
    select.innerHTML = "";
    for (const option of options) {
      const element = document.createElement("option");
      element.value = option.value;
      element.textContent = option.label;
      if (option.disabled) {
        element.disabled = true;
      }
      if (multiple && Array.isArray(selectedValue)) {
        element.selected = selectedValue.includes(option.value);
      } else if (option.value === selectedValue) {
        element.selected = true;
      }
      select.append(element);
    }
  }
  function populateControls() {
    var _a, _b;
    const sessionOptions = [{ value: "all", label: "\u0412\u0441\u0435 \u0441\u0435\u0441\u0441\u0438\u0438" }];
    if ((_b = (_a = state.dataset) == null ? void 0 : _a.sessions) == null ? void 0 : _b.length) {
      for (const session of state.dataset.sessions) {
        sessionOptions.push({
          value: session.id,
          label: `${session.label} \xB7 ${session.count} \u0441\u0442\u0440\u043E\u043A`
        });
      }
    }
    populateSelect(dom.sessionSelect, sessionOptions, state.filters.sessionId);
    const metricOptions = state.metricCatalog.map((metric) => {
      const unit = getMetricUnit(metric, state.filters.mode, state.calibration);
      const target = metric.category === "mq" && metric.target ? ` \xB7 ${metric.target}` : "";
      return {
        value: metric.key,
        label: `${metric.label}${target}${unit ? ` \xB7 ${unit}` : ""}`
      };
    });
    populateSelect(dom.metricSelect, metricOptions, state.filters.metric);
    populateSelect(dom.scatterX, metricOptions, state.scatterX);
    populateSelect(dom.scatterY, metricOptions, state.scatterY);
    populateSelect(dom.timelineMetrics, metricOptions, state.timelineMetrics, { multiple: true });
    dom.modeSelect.value = state.filters.mode;
    dom.modeSelect.disabled = !MQ_SENSORS.includes(state.filters.metric);
    dom.fromInput.value = state.filters.from;
    dom.toInput.value = state.filters.to;
    dom.metricMinInput.value = state.filters.metricMin;
    dom.metricMaxInput.value = state.filters.metricMax;
    dom.onlyGpsToggle.checked = state.filters.onlyGps;
    dom.onlyWeatherToggle.checked = state.filters.onlyWeather;
    dom.hideSuspiciousToggle.checked = state.filters.hideSuspiciousGps;
    dom.hideMqOffToggle.checked = state.filters.hideMqOff;
    if (dom.viewportToggle) {
      dom.viewportToggle.checked = state.filters.filterByViewport;
    }
    dom.idwToggle.checked = state.filters.showIdw;
  }
  function detailRow(label, value) {
    return `<div class="detail-row"><span>${label}</span><strong>${value}</strong></div>`;
  }
  function buildKpiCards(evaluation) {
    var _a;
    if (!state.dataset) {
      return [
        { label: "\u0421\u0442\u0440\u043E\u043A\u0438", value: "\u2014", meta: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 CSV" },
        { label: "\u0421\u0435\u0441\u0441\u0438\u0438", value: "\u2014", meta: "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0434\u0435\u043B\u0435\u043D\u0438\u0435 \u043F\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438" },
        { label: "GPS", value: "\u2014", meta: "\u0422\u043E\u0447\u043A\u0438 \u0434\u043B\u044F \u0442\u0440\u0435\u043A\u0430" },
        { label: "\u041F\u043E\u0433\u043E\u0434\u0430", value: "\u2014", meta: "\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430 \u0438 \u0432\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C" },
        { label: "MQ-off", value: "\u2014", meta: "\u041F\u043E\u0447\u0442\u0438 \u043D\u0443\u043B\u0435\u0432\u044B\u0435 \u043A\u0430\u043D\u0430\u043B\u044B" },
        { label: "\u0410\u043A\u0442\u0438\u0432\u043D\u0430\u044F \u043C\u0435\u0442\u0440\u0438\u043A\u0430", value: "\u2014", meta: "\u0421\u0440\u0435\u0434\u043D\u0435\u0435 \u0438 \u043F\u0438\u043A\u0438" }
      ];
    }
    const activeValues = evaluation.filteredRows.map((row) => getMetricValue(row, state.filters.metric, state.calibration, state.filters.mode)).filter((value) => Number.isFinite(value));
    const activeMean = activeValues.length ? activeValues.reduce((sum, value) => sum + value, 0) / activeValues.length : null;
    const activePeak = activeValues.length ? Math.max(...activeValues) : null;
    const activeMeta = getMetricMeta(state.metricCatalog, state.filters.metric);
    const activeUnit = getMetricUnit(activeMeta, state.filters.mode, state.calibration);
    const suspiciousHidden = evaluation.scopedRows.length - evaluation.filteredRows.length;
    return [
      {
        label: "\u0412\u0438\u0434\u0438\u043C\u044B\u0435 \u0441\u0442\u0440\u043E\u043A\u0438",
        value: formatInteger(evaluation.filteredRows.length),
        meta: `\u0412 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D\u0435: ${formatInteger(evaluation.scopedRows.length)}`
      },
      {
        label: "\u0421\u0435\u0441\u0441\u0438\u0438",
        value: formatInteger(state.dataset.sessions.length),
        meta: state.filters.sessionId === "all" ? "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u044E\u0442\u0441\u044F \u0432\u0441\u0435 \u0438\u0437\u043C\u0435\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u043E\u043A\u043D\u0430" : ((_a = state.dataset.sessions.find((item) => item.id === state.filters.sessionId)) == null ? void 0 : _a.subtitle) || "\u0412\u044B\u0431\u0440\u0430\u043D\u0430 \u043E\u0434\u043D\u0430 \u0441\u0435\u0441\u0441\u0438\u044F"
      },
      {
        label: "GPS \u0441\u0442\u0440\u043E\u043A\u0438",
        value: formatInteger(evaluation.coverage.gpsPresent),
        meta: `Valid: ${formatInteger(evaluation.coverage.gpsValid)} \xB7 \u0441\u043A\u0440\u044B\u0442\u043E \u0441\u0442\u0440\u043E\u043A: ${formatInteger(
          suspiciousHidden
        )}`
      },
      {
        label: "\u041F\u043E\u0433\u043E\u0434\u0430",
        value: formatInteger(evaluation.coverage.weatherCount),
        meta: `\u041F\u043E\u043A\u0440\u044B\u0442\u0438\u0435: ${formatPercent(
          evaluation.scopedRows.length ? evaluation.coverage.weatherCount / evaluation.scopedRows.length * 100 : 0,
          1
        )}`
      },
      {
        label: "MQ-off \u0441\u0442\u0440\u043E\u043A\u0438",
        value: formatInteger(evaluation.coverage.mqOffRows),
        meta: "\u0421\u0442\u0440\u043E\u043A\u0438 \u0441 \u043A\u0430\u043D\u0430\u043B\u0430\u043C\u0438 \u043D\u0438\u0436\u0435 powerOffThresholdRaw"
      },
      {
        label: "\u0410\u043A\u0442\u0438\u0432\u043D\u0430\u044F \u043C\u0435\u0442\u0440\u0438\u043A\u0430",
        value: activeMean !== null ? `${formatNumber(activeMean, 2)} ${activeUnit}` : "\u2014",
        meta: activePeak !== null ? `\u041F\u0438\u043A: ${formatNumber(activePeak, 2)} ${activeUnit}` : (activeMeta == null ? void 0 : activeMeta.label) || "\u2014"
      }
    ];
  }
  function renderKpis(evaluation) {
    dom.kpiGrid.innerHTML = buildKpiCards(evaluation).map(
      (card) => `
        <article class="kpi-card">
          <div class="kpi-label">${card.label}</div>
          <div class="kpi-value">${card.value}</div>
          <div class="kpi-meta">${card.meta}</div>
        </article>
      `
    ).join("");
  }
  function renderCoverageCard(evaluation) {
    const scoped = evaluation.scopedRows.length || 1;
    const satellitesText = evaluation.coverage.satellitesAvailable ? `${formatNumber(evaluation.coverage.satellitesAvg, 1)} \u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u043C \xB7 max ${formatInteger(
      evaluation.coverage.satellitesMax
    )}` : "\u043D\u0435\u0442 \u0432 CSV";
    dom.coverageCard.innerHTML = [
      detailRow("\u0421\u0442\u0440\u043E\u043A\u0438 \u0432 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D\u0435", formatInteger(evaluation.scopedRows.length)),
      detailRow("\u0421\u0442\u0440\u043E\u043A\u0438 \u043D\u0430 \u044D\u043A\u0440\u0430\u043D\u0435", formatInteger(evaluation.filteredRows.length)),
      detailRow("GPS \u0441\u0442\u0440\u043E\u043A\u0438", formatInteger(evaluation.coverage.gpsPresent)),
      detailRow(
        "GPS valid",
        `${formatInteger(evaluation.coverage.gpsValid)} (${formatPercent(
          evaluation.coverage.gpsValid / scoped * 100,
          1
        )})`
      ),
      detailRow("\u0421\u043F\u0443\u0442\u043D\u0438\u043A\u0438 GPS", satellitesText),
      detailRow(
        "\u041F\u043E\u0433\u043E\u0434\u0430",
        `${formatInteger(evaluation.coverage.weatherCount)} (${formatPercent(
          evaluation.coverage.weatherCount / scoped * 100,
          1
        )})`
      ),
      detailRow("MQ-off \u0441\u0442\u0440\u043E\u043A\u0438", formatInteger(evaluation.coverage.mqOffRows))
    ].join("");
  }
  function renderSelectedRowCard() {
    var _a, _b, _c;
    const row = (_b = (_a = state.evaluation) == null ? void 0 : _a.filteredRows) == null ? void 0 : _b.find((item) => item.id === state.selectedRowId);
    if (!row) {
      dom.selectedRowCard.innerHTML = '<p class="muted-text">\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u0442\u043E\u0447\u043A\u0443, \u0441\u0435\u0433\u043C\u0435\u043D\u0442 \u0442\u0440\u0435\u043A\u0430 \u0438\u043B\u0438 \u0442\u043E\u0447\u043A\u0443 \u043D\u0430 \u0433\u0440\u0430\u0444\u0438\u043A\u0435.</p>';
      return;
    }
    const activeMeta = getMetricMeta(state.metricCatalog, state.filters.metric);
    const activeValue = getMetricValue(
      row,
      state.filters.metric,
      state.calibration,
      state.filters.mode
    );
    const windDirection = applyWindDirection(row.values.WindDirRaw, state.calibration);
    const windSpeed = applyWindSpeed(row.values.WindSpeedRaw, state.calibration);
    const mqOffSensors = getMqUnpoweredSensors(row, state.calibration);
    const satelliteValue = ((_c = state.dataset) == null ? void 0 : _c.satelliteColumn) ? row.extras[state.dataset.satelliteColumn] : null;
    dom.selectedRowCard.innerHTML = [
      detailRow("\u0412\u0440\u0435\u043C\u044F", row.datetimeText),
      detailRow(
        (activeMeta == null ? void 0 : activeMeta.category) === "mq" && activeMeta.target ? `${activeMeta.label} \xB7 ${activeMeta.target}` : (activeMeta == null ? void 0 : activeMeta.label) || "\u0410\u043A\u0442\u0438\u0432\u043D\u0430\u044F \u043C\u0435\u0442\u0440\u0438\u043A\u0430",
        `${formatNumber(activeValue, 2)} ${getMetricUnit(
          activeMeta,
          state.filters.mode,
          state.calibration
        )}`
      ),
      detailRow("\u0428\u0438\u0440\u043E\u0442\u0430 / \u0434\u043E\u043B\u0433\u043E\u0442\u0430", `${formatNumber(row.values.Lat, 6)} / ${formatNumber(row.values.Lon, 6)}`),
      detailRow("\u0412\u0435\u0442\u0435\u0440", `${formatNumber(windSpeed, 2)} \u043C/\u0441 \xB7 ${windDirection.label}`),
      detailRow(
        "\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430 / \u0432\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C",
        `${formatNumber(row.values.TempC, 2)} \xB0C \xB7 ${formatNumber(row.values.Hum, 0)} %RH`
      ),
      detailRow(
        "\u0421\u043F\u0443\u0442\u043D\u0438\u043A\u0438 GPS",
        Number.isFinite(satelliteValue) ? formatInteger(satelliteValue) : "\u043D\u0435\u0442 \u0432 CSV"
      ),
      detailRow("\u0421\u0435\u0441\u0441\u0438\u044F", row.sessionId),
      detailRow("GPS \u0441\u0442\u0430\u0442\u0443\u0441", row.flags.gpsStatus),
      detailRow("MQ-off", mqOffSensors.length ? mqOffSensors.join(", ") : "\u043D\u0435\u0442")
    ].join("");
  }
  function renderLegend(metricMeta, metricRange) {
    const target = (metricMeta == null ? void 0 : metricMeta.category) === "mq" && metricMeta.target ? ` \xB7 ${metricMeta.target}` : "";
    dom.metricLegendLabel.textContent = `${(metricMeta == null ? void 0 : metricMeta.label) || "\u041C\u0435\u0442\u0440\u0438\u043A\u0430"}${target} \xB7 ${getMetricUnit(
      metricMeta,
      state.filters.mode,
      state.calibration
    ) || "\u0431\u0435\u0437 \u0435\u0434."}`;
    dom.metricLegendValues.innerHTML = `
    <span>${formatNumber(metricRange.min, 2)}</span>
    <span>${formatNumber(metricRange.max, 2)}</span>
  `;
  }
  function renderAnomalies(evaluation) {
    if (!evaluation.anomalies.length) {
      dom.anomalyBody.innerHTML = `
      <tr>
        <td colspan="3" class="muted-text">\u0412 \u0442\u0435\u043A\u0443\u0449\u0435\u043C \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D\u0435 \u043D\u0435 \u043E\u0431\u043D\u0430\u0440\u0443\u0436\u0435\u043D\u043E \u0430\u043D\u043E\u043C\u0430\u043B\u0438\u0439.</td>
      </tr>
    `;
      return;
    }
    const typeClass = (type) => {
      if (type.includes("GPS") || type.includes("\u0420\u0430\u0437\u0440\u044B\u0432")) {
        return "is-danger";
      }
      if (type.includes("MQ")) {
        return "is-warning";
      }
      return "";
    };
    dom.anomalyBody.innerHTML = evaluation.anomalies.map(
      (anomaly) => `
        <tr>
          <td>${formatDateTime(anomaly.timestamp)}</td>
          <td><span class="table-tag ${typeClass(anomaly.type)}">${anomaly.type}</span></td>
          <td>${anomaly.detail}</td>
        </tr>
      `
    ).join("");
  }
  function renderExportSummary(evaluation) {
    var _a;
    if (!state.dataset) {
      dom.exportSummary.innerHTML = [
        detailRow("\u042D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u0443\u0435\u043C\u044B\u0445 \u0441\u0442\u0440\u043E\u043A", "\u2014"),
        detailRow("\u0421\u0435\u0441\u0441\u0438\u044F", "\u2014"),
        detailRow("\u0410\u043A\u0442\u0438\u0432\u043D\u0430\u044F \u043C\u0435\u0442\u0440\u0438\u043A\u0430", state.filters.metric),
        detailRow("\u0420\u0435\u0436\u0438\u043C", state.filters.mode)
      ].join("");
      return;
    }
    const sessionLabel = state.filters.sessionId === "all" ? "\u0432\u0441\u0435 \u0441\u0435\u0441\u0441\u0438\u0438" : ((_a = state.dataset.sessions.find((item) => item.id === state.filters.sessionId)) == null ? void 0 : _a.label) || state.filters.sessionId;
    dom.exportSummary.innerHTML = [
      detailRow("\u042D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u0443\u0435\u043C\u044B\u0445 \u0441\u0442\u0440\u043E\u043A", formatInteger(evaluation.filteredRows.length)),
      detailRow("\u0421\u0435\u0441\u0441\u0438\u044F", sessionLabel),
      detailRow("\u0410\u043A\u0442\u0438\u0432\u043D\u0430\u044F \u043C\u0435\u0442\u0440\u0438\u043A\u0430", state.filters.metric),
      detailRow("\u0420\u0435\u0436\u0438\u043C", state.filters.mode)
    ].join("");
  }
  function refreshCalibrationRowOutputs(sensor) {
    const entry = roundCalibrationEntry(state.calibration.mqSensors[sensor]);
    const row = dom.mqCalibrationBody.querySelector(`[data-sensor-row="${sensor}"]`);
    if (!row) {
      return;
    }
    row.querySelector('[data-output="slope"]').textContent = formatNumber(entry.slope, 8);
    row.querySelector('[data-output="offset"]').textContent = formatNumber(entry.offset, 4);
  }
  function renderCalibrationTables() {
    dom.mqCalibrationBody.innerHTML = MQ_SENSORS.map((sensor) => {
      const entry = roundCalibrationEntry(state.calibration.mqSensors[sensor]);
      return `
      <tr data-sensor-row="${sensor}">
        <td>
          <div>${sensor}</div>
          <div class="muted-text">${entry.note}</div>
        </td>
        <td class="mq-target-cell">${MQ_SENSOR_TARGETS[sensor] || "\u2014"}</td>
        <td><input data-kind="mq" data-sensor="${sensor}" data-field="unit" type="text" value="${entry.unit}" /></td>
        <td><input data-kind="mq" data-sensor="${sensor}" data-field="point1.raw" type="number" step="any" value="${entry.point1.raw}" /></td>
        <td><input data-kind="mq" data-sensor="${sensor}" data-field="point1.value" type="number" step="any" value="${entry.point1.value}" /></td>
        <td><input data-kind="mq" data-sensor="${sensor}" data-field="point2.raw" type="number" step="any" value="${entry.point2.raw}" /></td>
        <td><input data-kind="mq" data-sensor="${sensor}" data-field="point2.value" type="number" step="any" value="${entry.point2.value}" /></td>
        <td><input data-kind="mq" data-sensor="${sensor}" data-field="powerOffThresholdRaw" type="number" step="any" value="${entry.powerOffThresholdRaw}" /></td>
        <td data-output="slope">${formatNumber(entry.slope, 8)}</td>
        <td data-output="offset">${formatNumber(entry.offset, 4)}</td>
      </tr>
    `;
    }).join("");
    dom.windSpeedOffset.value = state.calibration.wind.speed.offsetRaw;
    dom.windSpeedScale.value = state.calibration.wind.speed.scaleMpsPerRaw;
    dom.windAnchorBody.innerHTML = state.calibration.wind.directionAnchors.map(
      (anchor, index) => `
        <tr data-anchor-index="${index}">
          <td><input data-kind="wind-anchor" data-index="${index}" data-field="raw" type="number" step="any" value="${anchor.raw}" /></td>
          <td><input data-kind="wind-anchor" data-index="${index}" data-field="degrees" type="number" step="any" value="${anchor.degrees}" /></td>
          <td><input data-kind="wind-anchor" data-index="${index}" data-field="label" type="text" value="${anchor.label}" /></td>
          <td><input data-kind="wind-anchor" data-index="${index}" data-field="tolerance" type="number" step="any" value="${anchor.tolerance}" /></td>
          <td><div class="table-actions"><button class="button-small" type="button" data-action="remove-anchor" data-index="${index}">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</button></div></td>
        </tr>
      `
    ).join("");
  }
  function applyPresetToState(preset, { resetFilters = false } = {}) {
    state.calibration = normalizeCalibrationPreset(preset);
    refreshMetricCatalog();
    const uiDefaults = mergeUiDefaults(state.calibration.uiDefaults);
    if (resetFilters) {
      state.filters = { ...DEFAULT_UI_FILTERS, ...uiDefaults.filters };
      state.timelineMetrics = [...uiDefaults.timelineMetrics];
      state.scatterX = uiDefaults.scatterX;
      state.scatterY = uiDefaults.scatterY;
    }
    if (state.dataset) {
      const bounds = getSessionBounds(state.dataset, state.filters.sessionId);
      if (!state.filters.from) {
        state.filters.from = bounds.from;
      }
      if (!state.filters.to) {
        state.filters.to = bounds.to;
      }
    }
  }
  async function loadPresetText(presetText, { resetFilters = false } = {}) {
    if (!presetText) {
      return;
    }
    const parsed = JSON.parse(presetText);
    applyPresetToState(parsed, { resetFilters });
    renderCalibrationTables();
    populateControls();
  }
  async function loadDataset(csvText, { presetText = null, sourceLabel = "CSV" } = {}) {
    if (!csvText) {
      throw new Error("\u041F\u0443\u0441\u0442\u043E\u0439 CSV");
    }
    if (presetText) {
      await loadPresetText(presetText, { resetFilters: true });
    } else if (!state.dataset) {
      applyPresetToState(buildDefaultCalibrationPreset(), { resetFilters: true });
    }
    const dataset = parseCsvText(csvText);
    state.dataset = dataset;
    state.selectedRowId = null;
    refreshMetricCatalog();
    const bounds = getSessionBounds(dataset, state.filters.sessionId);
    state.filters.from = state.filters.from || bounds.from;
    state.filters.to = state.filters.to || bounds.to;
    renderCalibrationTables();
    populateControls();
    renderAll(true);
    dom.datasetMeta.textContent = `${sourceLabel}: ${dataset.totalRows} \u0441\u0442\u0440\u043E\u043A, ${dataset.sessions.length} \u0441\u0435\u0441\u0441\u0438\u0438(\u0439), ${dataset.numericExtraColumns.length} extra-\u043A\u043E\u043B\u043E\u043D\u043E\u043A.`;
    if (dataset.calendarStart && dataset.calendarEnd) {
      dom.datasetMeta.textContent = `${sourceLabel}: ${dataset.totalRows} \u0441\u0442\u0440\u043E\u043A, ${dataset.sessions.length} \u0441\u0435\u0441\u0441\u0438\u0438(\u0439), \u0430\u043A\u0442\u0438\u0432\u043D\u0430\u044F \u0437\u0430\u043F\u0438\u0441\u044C ${formatDurationMs(
        dataset.activeDurationMs
      )}, \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u043D\u044B\u0439 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D ${formatDateTime(dataset.calendarStart)} .. ${formatDateTime(
        dataset.calendarEnd
      )}.`;
    }
    setStatus(`\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u0430: ${dataset.totalRows} \u0441\u0442\u0440\u043E\u043A \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u043E.`, "success");
  }
  async function loadBuiltInMonitorCsv({ silent = false } = {}) {
    try {
      if (window.location.protocol === "file:" && EMBEDDED_MONITOR_CSV) {
        await loadDataset(EMBEDDED_MONITOR_CSV, {
          sourceLabel: "MONITOR.CSV (\u0432\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u044B\u0439 \u043F\u0440\u0438\u043C\u0435\u0440)"
        });
        return true;
      }
      if (!silent) {
        setStatus("\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u044E \u0432\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u044B\u0439 MONITOR.CSV\u2026");
      }
      const response = await fetch("./MONITOR.CSV", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const csvText = await response.text();
      await loadDataset(csvText, {
        sourceLabel: "MONITOR.CSV (\u0432\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u044B\u0439 \u043F\u0440\u0438\u043C\u0435\u0440)"
      });
      return true;
    } catch (error) {
      console.warn("Built-in MONITOR.CSV autoload failed:", error);
      if (!silent) {
        setStatus(
          "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0432\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u044B\u0439 MONITOR.CSV. \u0415\u0441\u043B\u0438 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043E\u0442\u043A\u0440\u044B\u0442\u0430 \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u043A\u0430\u043A file://, \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 CSV \u0432\u0440\u0443\u0447\u043D\u0443\u044E.",
          "warning"
        );
      }
      return false;
    }
  }
  function getRowMetricValue(row, metricKey = state.filters.metric) {
    return getMetricValue(row, metricKey, state.calibration, state.filters.mode);
  }
  function renderAll(fitMap = false) {
    var _a, _b, _c;
    if (!state.dataset) {
      const emptyEvaluation = {
        scopedRows: [],
        filteredRows: [],
        coverage: {
          gpsPresent: 0,
          gpsValid: 0,
          gpsSuspicious: 0,
          weatherCount: 0,
          mqOffRows: 0,
          satellitesAvailable: false,
          satellitesAvg: null,
          satellitesMax: null
        },
        metricRange: { min: null, max: null },
        anomalies: [],
        mappedRows: []
      };
      state.evaluation = emptyEvaluation;
      renderKpis(emptyEvaluation);
      renderCoverageCard(emptyEvaluation);
      renderSelectedRowCard();
      renderLegend(null, emptyEvaluation.metricRange);
      renderAnomalies(emptyEvaluation);
      renderExportSummary(emptyEvaluation);
      charts.updateTimeline({
        rows: [],
        metricKeys: [],
        metricCatalog: state.metricCatalog,
        getMetricValueForKey: getRowMetricValue,
        getMetricUnitForKey: (metricKey) => getMetricUnit(getMetricMeta(state.metricCatalog, metricKey), state.filters.mode, state.calibration),
        selectedRowId: null,
        subtitle: ""
      });
      charts.updateHeatmap({
        rows: [],
        metricKeys: [],
        metricCatalog: state.metricCatalog,
        getMetricValueForKey: getRowMetricValue
      });
      charts.updateScatter({
        rows: [],
        xMetric: state.scatterX,
        yMetric: state.scatterY,
        metricCatalog: state.metricCatalog,
        getMetricValueForKey: getRowMetricValue,
        activeMetricKey: state.filters.metric
      });
      charts.updateWeather({ rows: [] });
      mapController.update({
        mappedRows: [],
        activeMetricLabel: "\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445",
        activeMetricUnit: "",
        getRowMetricValue,
        selectedRowId: null,
        showIdw: false,
        fitToRows: false
      });
      return;
    }
    refreshMetricCatalog();
    populateControls();
    const evaluation = evaluateDataset(
      state.dataset,
      state.filters,
      state.calibration,
      state.viewportBounds
    );
    state.evaluation = evaluation;
    if (!evaluation.filteredRows.some((row) => row.id === state.selectedRowId)) {
      state.selectedRowId = ((_a = evaluation.filteredRows[0]) == null ? void 0 : _a.id) || null;
    }
    const activeMeta = getMetricMeta(state.metricCatalog, state.filters.metric);
    renderKpis(evaluation);
    renderCoverageCard(evaluation);
    renderSelectedRowCard();
    renderLegend(activeMeta, evaluation.metricRange);
    renderAnomalies(evaluation);
    renderExportSummary(evaluation);
    charts.updateTimeline({
      rows: evaluation.filteredRows,
      metricKeys: state.timelineMetrics,
      metricCatalog: state.metricCatalog,
      getMetricValueForKey: (row, metricKey) => getRowMetricValue(row, metricKey),
      getMetricUnitForKey: (metricKey) => getMetricUnit(getMetricMeta(state.metricCatalog, metricKey), state.filters.mode, state.calibration),
      selectedRowId: state.selectedRowId,
      subtitle: ((_b = state.dataset) == null ? void 0 : _b.calendarStart) && ((_c = state.dataset) == null ? void 0 : _c.calendarEnd) ? `\u0410\u043A\u0442\u0438\u0432\u043D\u0430\u044F \u0437\u0430\u043F\u0438\u0441\u044C ${formatDurationMs(
        state.dataset.activeDurationMs
      )} \xB7 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u043D\u044B\u0439 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D ${formatDateTime(state.dataset.calendarStart)} .. ${formatDateTime(
        state.dataset.calendarEnd
      )}` : `${evaluation.filteredRows.length} \u0441\u0442\u0440\u043E\u043A \u0432 \u0442\u0435\u043A\u0443\u0449\u0435\u043C \u0441\u0440\u0435\u0437\u0435`
    });
    charts.updateHeatmap({
      rows: evaluation.filteredRows,
      metricKeys: buildHeatmapMetricList(state.metricCatalog),
      metricCatalog: state.metricCatalog,
      getMetricValueForKey: (row, metricKey) => getRowMetricValue(row, metricKey)
    });
    charts.updateScatter({
      rows: evaluation.filteredRows,
      xMetric: state.scatterX,
      yMetric: state.scatterY,
      metricCatalog: state.metricCatalog,
      getMetricValueForKey: (row, metricKey) => getRowMetricValue(row, metricKey),
      activeMetricKey: state.filters.metric
    });
    charts.updateWeather({ rows: evaluation.filteredRows });
    mapController.update({
      mappedRows: evaluation.mappedRows,
      activeMetricLabel: (activeMeta == null ? void 0 : activeMeta.label) || state.filters.metric,
      activeMetricUnit: getMetricUnit(activeMeta, state.filters.mode, state.calibration),
      getRowMetricValue,
      selectedRowId: state.selectedRowId,
      showIdw: state.filters.showIdw,
      fitToRows: fitMap
    });
  }
  var debouncedCalibrationRender = debounce(() => {
    refreshMetricCatalog();
    populateControls();
    renderAll(false);
  }, 120);
  function setMqField(sensor, fieldPath, value) {
    var _a, _b, _c;
    const entry = state.calibration.mqSensors[sensor];
    if (!entry) {
      return;
    }
    if (fieldPath === "unit") {
      entry.unit = value;
    } else if (fieldPath === "powerOffThresholdRaw") {
      entry.powerOffThresholdRaw = (_a = safeNumber(value)) != null ? _a : 0;
    } else if (fieldPath.startsWith("point1.")) {
      entry.point1[fieldPath.split(".")[1]] = (_b = safeNumber(value)) != null ? _b : 0;
    } else if (fieldPath.startsWith("point2.")) {
      entry.point2[fieldPath.split(".")[1]] = (_c = safeNumber(value)) != null ? _c : 0;
    }
    state.calibration.mqSensors[sensor] = recomputeMqEntry(entry);
  }
  function bindEvents() {
    dom.loadFilesBtn.addEventListener("click", async () => {
      var _a, _b;
      try {
        const csvFile = (_a = dom.csvFileInput.files) == null ? void 0 : _a[0];
        if (!csvFile) {
          setStatus("\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 CSV-\u0444\u0430\u0439\u043B.", "warning");
          return;
        }
        const [csvText, presetText] = await Promise.all([
          readFileText(csvFile),
          readFileText((_b = dom.presetFileInput.files) == null ? void 0 : _b[0])
        ]);
        await loadDataset(csvText, {
          presetText,
          sourceLabel: csvFile.name
        });
      } catch (error) {
        console.error(error);
        setStatus(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438: ${error.message}`, "danger");
      }
    });
    dom.loadDemoBtn.addEventListener("click", async () => {
      await loadBuiltInMonitorCsv();
    });
    dom.sessionSelect.addEventListener("change", () => {
      state.filters.sessionId = dom.sessionSelect.value;
      const bounds = getSessionBounds(state.dataset, state.filters.sessionId);
      state.filters.from = bounds.from;
      state.filters.to = bounds.to;
      renderAll(true);
    });
    dom.fromInput.addEventListener("change", () => {
      state.filters.from = dom.fromInput.value;
      renderAll(false);
    });
    dom.toInput.addEventListener("change", () => {
      state.filters.to = dom.toInput.value;
      renderAll(false);
    });
    dom.metricSelect.addEventListener("change", () => {
      state.filters.metric = dom.metricSelect.value;
      if (!state.timelineMetrics.includes(state.filters.metric)) {
        state.timelineMetrics = [state.filters.metric, ...state.timelineMetrics].slice(0, 6);
      }
      renderAll(false);
    });
    dom.modeSelect.addEventListener("change", () => {
      state.filters.mode = dom.modeSelect.value;
      renderAll(false);
    });
    dom.metricMinInput.addEventListener("change", () => {
      state.filters.metricMin = dom.metricMinInput.value;
      renderAll(false);
    });
    dom.metricMaxInput.addEventListener("change", () => {
      state.filters.metricMax = dom.metricMaxInput.value;
      renderAll(false);
    });
    [
      ["onlyGpsToggle", "onlyGps"],
      ["onlyWeatherToggle", "onlyWeather"],
      ["hideSuspiciousToggle", "hideSuspiciousGps"],
      ["hideMqOffToggle", "hideMqOff"],
      ["viewportToggle", "filterByViewport"],
      ["idwToggle", "showIdw"]
    ].forEach(([elementKey, filterKey]) => {
      if (!dom[elementKey]) {
        return;
      }
      dom[elementKey].addEventListener("change", () => {
        state.filters[filterKey] = dom[elementKey].checked;
        renderAll(filterKey === "filterByViewport");
      });
    });
    dom.timelineMetrics.addEventListener("change", () => {
      state.timelineMetrics = Array.from(dom.timelineMetrics.selectedOptions).map(
        (option) => option.value
      );
      renderAll(false);
    });
    dom.scatterX.addEventListener("change", () => {
      state.scatterX = dom.scatterX.value;
      renderAll(false);
    });
    dom.scatterY.addEventListener("change", () => {
      state.scatterY = dom.scatterY.value;
      renderAll(false);
    });
    dom.mqCalibrationBody.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      const sensor = target.dataset.sensor;
      const field = target.dataset.field;
      if (!sensor || !field) {
        return;
      }
      setMqField(sensor, field, target.value);
      refreshCalibrationRowOutputs(sensor);
      debouncedCalibrationRender();
    });
    dom.windSpeedOffset.addEventListener("input", () => {
      var _a;
      state.calibration.wind.speed.offsetRaw = (_a = safeNumber(dom.windSpeedOffset.value)) != null ? _a : 40;
      debouncedCalibrationRender();
    });
    dom.windSpeedScale.addEventListener("input", () => {
      var _a;
      state.calibration.wind.speed.scaleMpsPerRaw = (_a = safeNumber(dom.windSpeedScale.value)) != null ? _a : 0.01;
      debouncedCalibrationRender();
    });
    dom.windAnchorBody.addEventListener("input", (event) => {
      var _a;
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      const index = Number(target.dataset.index);
      const field = target.dataset.field;
      const anchor = state.calibration.wind.directionAnchors[index];
      if (!anchor) {
        return;
      }
      anchor[field] = field === "label" ? target.value : (_a = safeNumber(target.value)) != null ? _a : 0;
      debouncedCalibrationRender();
    });
    dom.windAnchorBody.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action='remove-anchor']");
      if (!button) {
        return;
      }
      const index = Number(button.dataset.index);
      state.calibration.wind.directionAnchors.splice(index, 1);
      renderCalibrationTables();
      debouncedCalibrationRender();
    });
    dom.addWindAnchorBtn.addEventListener("click", () => {
      state.calibration.wind.directionAnchors.push({
        raw: 0,
        degrees: 0,
        label: "New",
        tolerance: 1200
      });
      renderCalibrationTables();
      debouncedCalibrationRender();
    });
    dom.saveCalibrationBtn.addEventListener("click", () => {
      const payload = serializeCalibrationPreset(
        buildCalibrationSnapshot(state.calibration, {
          filters: state.filters,
          timelineMetrics: state.timelineMetrics,
          scatterX: state.scatterX,
          scatterY: state.scatterY
        }),
        {
          filters: state.filters,
          timelineMetrics: state.timelineMetrics,
          scatterX: state.scatterX,
          scatterY: state.scatterY
        }
      );
      downloadTextFile("air-quality-calibration.json", payload, "application/json;charset=utf-8");
    });
    dom.loadCalibrationBtn.addEventListener("click", () => {
      state.pendingPresetLoadOnly = true;
      dom.presetFileInput.click();
    });
    dom.presetFileInput.addEventListener("change", async () => {
      var _a;
      if (!state.pendingPresetLoadOnly || !((_a = dom.presetFileInput.files) == null ? void 0 : _a[0])) {
        return;
      }
      try {
        const presetText = await readFileText(dom.presetFileInput.files[0]);
        await loadPresetText(presetText, { resetFilters: false });
        renderCalibrationTables();
        renderAll(false);
        setStatus(`\u041F\u0440\u0435\u0441\u0435\u0442 ${dom.presetFileInput.files[0].name} \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D.`, "success");
      } catch (error) {
        console.error(error);
        setStatus(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u043F\u0440\u0435\u0441\u0435\u0442\u0430: ${error.message}`, "danger");
      } finally {
        state.pendingPresetLoadOnly = false;
      }
    });
    dom.exportCsvBtn.addEventListener("click", () => {
      if (!state.dataset || !state.evaluation) {
        setStatus("\u041D\u0435\u0442 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0430.", "warning");
        return;
      }
      const rows = buildExportRows(
        state.evaluation.filteredRows,
        state.calibration,
        state.dataset.numericExtraColumns
      );
      const csvText = window.Papa.unparse(rows);
      downloadTextFile("monitor_filtered_export.csv", csvText, "text/csv;charset=utf-8");
    });
    dom.resetFiltersBtn.addEventListener("click", () => {
      state.filters = { ...DEFAULT_UI_FILTERS };
      if (state.dataset) {
        const bounds = getSessionBounds(state.dataset, "all");
        state.filters.from = bounds.from;
        state.filters.to = bounds.to;
      }
      renderAll(true);
    });
    window.addEventListener(
      "resize",
      debounce(() => {
        charts.resize();
        mapController.resize();
      }, 120)
    );
  }
  bindEvents();
  renderCalibrationTables();
  populateControls();
  renderAll(false);
  loadBuiltInMonitorCsv({ silent: true });
})();
