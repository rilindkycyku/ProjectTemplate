import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// ── Colours (matching the app's theme) ────────────────
const CLR = {
  headerBg: "FF0D2137", // dark navy
  headerFg: "FFFFFFFF", // white
  titleBg: "FF6366F1", // indigo primary
  titleFg: "FFFFFFFF",
  labelFg: "FF94A3B8", // soft grey
  valueFg: "FFF1F5F9", // near-white
  rowAlt: "FF111D2E", // surface-2
  rowEven: "FF0D1520", // surface
  totBg: "FF4F46E5", // indigo-600
  totFg: "FFFFFFFF",
  border: "FF1E3A5F",
  tableHead: "FF6366F1", // indigo primary
  tableHeadFg: "FFFFFFFF",
};

const border = (color = CLR.border) => ({
  top: { style: "thin", color: { argb: color } },
  left: { style: "thin", color: { argb: color } },
  bottom: { style: "thin", color: { argb: color } },
  right: { style: "thin", color: { argb: color } },
});

const fill = (argb) => ({ type: "pattern", pattern: "solid", fgColor: { argb } });

const font = (bold = false, color = CLR.valueFg, size = 11) => ({
  bold, color: { argb: color }, size, name: "Calibri",
});

/**
 * Reusable utility to export ANY flat data list into a beautifully styled ExcelJS workbook.
 */
export async function exportListExcel(title, headers, data, filename = "Eksport.xlsx", biznesit) {
  const shopName = biznesit?.emriIBiznesit || "Project Template by Rilind Kyçyku";
  const shopNUI = `NUI: ${biznesit?.nui || "–"} / NF: ${biznesit?.nf || "–"} / TVSH: ${biznesit?.nrTVSH || "–"}`;
  const shopContact = `${biznesit?.adresa || "–"} / ${biznesit?.nrKontaktit || "–"}`;

  const wb = new ExcelJS.Workbook();
  wb.creator = "System";
  wb.created = new Date();

  const safeSheetName = (title || "Sheet")
    .replace(/[*?:\/\[\]\\]/g, "-")
    .substring(0, 31);

  const ws = wb.addWorksheet(safeSheetName, {
    views: [{ state: "frozen", ySplit: 6 }],
    properties: { tabColor: { argb: CLR.tableHead } },
  });

  // 1. Title Row
  const titleRow = ws.addRow([title, ...new Array(headers.length - 1).fill("")]);
  ws.mergeCells(1, 1, 1, headers.length);
  titleRow.height = 32;
  const titleCell = titleRow.getCell(1);
  titleCell.font = { bold: true, color: { argb: CLR.titleFg }, size: 14, name: "Calibri" };
  titleCell.fill = fill(CLR.titleBg);
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  // 1.5. Dynamic Metadata Header Rows (Rows 3 & 4)
  ws.addRow([]).height = 6; // Row 2: Blank spacer

  const dateStr = new Date().toLocaleString("en-GB");
  const username = localStorage.getItem("username") || "Administrator";

  const row3 = ws.addRow([`Company: ${shopName}`, ...new Array(headers.length - 1).fill("")]);
  row3.height = 20;

  const row4 = ws.addRow([`Details: ${shopNUI}`, ...new Array(headers.length - 1).fill("")]);
  row4.height = 20;

  const safeMerge = (rowNum, startCol, endCol) => {
    if (endCol > startCol) {
      try {
        ws.mergeCells(rowNum, startCol, rowNum, endCol);
      } catch (e) {
        console.warn("Cell merge warning:", e);
      }
    }
  };

  if (headers.length >= 3) {
    const half = Math.floor(headers.length / 2);
    safeMerge(3, 1, half);
    safeMerge(3, half + 1, headers.length);
    row3.getCell(1).value = `Company: ${shopName}`;
    row3.getCell(half + 1).value = `Date: ${dateStr}`;
    row3.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
    row3.getCell(half + 1).alignment = { horizontal: "right", vertical: "middle" };

    const segment = Math.floor(headers.length / 3);
    safeMerge(4, 1, segment);
    safeMerge(4, segment + 1, segment * 2);
    safeMerge(4, segment * 2 + 1, headers.length);
    row4.getCell(1).value = `Details: ${shopNUI}`;
    row4.getCell(segment + 1).value = `Contact: ${shopContact}`;
    row4.getCell(segment * 2 + 1).value = `Operator: ${username}`;
    row4.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
    row4.getCell(segment + 1).alignment = { horizontal: "center", vertical: "middle" };
    row4.getCell(segment * 2 + 1).alignment = { horizontal: "right", vertical: "middle" };
  } else {
    safeMerge(3, 1, headers.length);
    safeMerge(4, 1, headers.length);
    row3.getCell(1).value = `Company: ${shopName} | Date: ${dateStr}`;
    row4.getCell(1).value = `Details: ${shopNUI} | Operator: ${username}`;
    row3.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
    row4.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
  }

  [row3, row4].forEach(row => {
    row.eachCell(cell => {
      cell.font = { size: 9, italic: true, color: { argb: CLR.labelFg }, name: "Calibri" };
      cell.fill = fill(CLR.headerBg);
    });
  });

  // 2. Blank Row spacer
  ws.addRow([]).height = 6;

  // 3. Header Row
  const tHead = ws.addRow(headers);
  tHead.height = 24;
  headers.forEach((h, idx) => {
    const cell = tHead.getCell(idx + 1);
    cell.fill = fill(CLR.tableHead);
    cell.font = font(true, CLR.tableHeadFg, 11);
    cell.border = border(CLR.border);
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // 4. Data Rows
  data.forEach((r, idx) => {
    const bgArgb = idx % 2 === 0 ? CLR.rowEven : CLR.rowAlt;
    const values = headers.map(h => r[h] !== undefined && r[h] !== null ? r[h] : "");
    const row = ws.addRow(values);
    row.height = 19;
    headers.forEach((h, colIdx) => {
      const cell = row.getCell(colIdx + 1);
      cell.fill = fill(bgArgb);
      cell.font = font(false, CLR.valueFg);
      cell.border = border();

      const valStr = String(values[colIdx]);
      if (/^-?\d+(\.\d+)?\s*€?$/.test(valStr) || !isNaN(Number(valStr.replace("€", "").trim()))) {
        cell.alignment = { horizontal: "right" };
      } else {
        cell.alignment = { horizontal: "left" };
      }
    });
  });

  // Auto-fit Column Widths
  ws.columns.forEach((col, colIdx) => {
    let maxLen = headers[colIdx].length;
    data.forEach(r => {
      const val = String(r[headers[colIdx]] || "");
      if (val.length > maxLen) maxLen = val.length;
    });
    col.width = Math.min(Math.max(maxLen + 4, 12), 45);
  });

  // Branding & Copyright
  ws.addRow([]);
  const brandRowData = new Array(headers.length).fill("");
  brandRowData[0] = `© ${new Date().getFullYear()} Project Template by Rilind Kyçyku`;

  if (headers.length >= 4) {
    const leftSpan = Math.floor(headers.length * 0.6);
    brandRowData[leftSpan] = "WWW.RILINDKYCYKU.DEV";
    const brandRow = ws.addRow(brandRowData);
    brandRow.height = 20;
    ws.mergeCells(brandRow.number, 1, brandRow.number, leftSpan);
    ws.mergeCells(brandRow.number, leftSpan + 1, brandRow.number, headers.length);
    
    const leftCell = brandRow.getCell(1);
    leftCell.font = { italic: true, size: 9, color: { argb: "FF94A3B8" }, name: "Calibri" };
    leftCell.alignment = { horizontal: "left", vertical: "middle" };

    const rightCell = brandRow.getCell(leftSpan + 1);
    rightCell.font = { bold: true, size: 9, color: { argb: "FF6366F1" }, name: "Calibri" };
    rightCell.alignment = { horizontal: "right", vertical: "middle" };
  } else {
    brandRowData[headers.length - 1] = "WWW.RILINDKYCYKU.DEV";
    const brandRow = ws.addRow(brandRowData);
    brandRow.height = 20;
    
    const leftCell = brandRow.getCell(1);
    leftCell.font = { italic: true, size: 9, color: { argb: "FF94A3B8" }, name: "Calibri" };
    leftCell.alignment = { horizontal: "left", vertical: "middle" };

    const rightCell = brandRow.getCell(headers.length);
    rightCell.font = { bold: true, size: 9, color: { argb: "FF6366F1" }, name: "Calibri" };
    rightCell.alignment = { horizontal: "right", vertical: "middle" };
  }

  // Save
  const buffer = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  }), filename);
}
