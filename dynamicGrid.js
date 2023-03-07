class DynamicGrid {
  constructor(obj, host) {
    this.obj = obj;
    this.host = host;
    this.table = document.createElement("table");
    this.host.appendChild(this.table);
    this.render();
    this.callbacks = { add: [], remove: [], change: [] };
  }

  render() {
    // Add table header

    const thead = document.createElement("thead");
    this.table.appendChild(thead);

    const tr = document.createElement("tr");
    thead.appendChild(tr);
    this.obj.layout.columns.forEach((column, index) => {
      const th = document.createElement("th");
      th.innerText = column;
      tr.appendChild(th);

      th.addEventListener("click", () => {
        this.sortTable(index);
      });
    });

    // Add table body
    const tbody = document.createElement("tbody");
    this.table.appendChild(tbody);
    this.obj.rows.forEach((row, rowIndex) => {
      const tr = document.createElement("tr");
      tbody.appendChild(tr);
      row.forEach((cellData, columnIndex) => {
        const cell = new Cell(cellData, rowIndex, columnIndex);
        const td = cell.render();
        tr.appendChild(td);
      });
    });
    const cells = this.table.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("data-updated", (event) => {
        const newData = event.detail.newData;
        const oldData = event.detail.oldData;
        const rowIndex = cell.parentNode.rowIndex - 1;
        const columnIndex = cell.cellIndex;
        this.updateCell({ rowIndex, columnIndex, newData, oldData });
      });
    });
  }
  updateCell({ rowIndex, columnIndex, newData, oldData }) {
    const newItem = {
      col: columnIndex,
      row: rowIndex,
      oldVal: oldData,
      newVal: newData,
    };
    this.callbacks.change.forEach((callback) => {
      callback(newItem);
    });
  }

  add(rowData) {
    const tbody = this.table.querySelector("tbody");
    const tr = document.createElement("tr");
    tbody.appendChild(tr);
    rowData.forEach((cellData) => {
      const cell = new Cell(cellData);
      const td = cell.render();
      tr.appendChild(td);
    });
    const newItem = { index: tbody.rows.length - 1, data: rowData };
    this.callbacks.add.forEach((callback) => {
      callback(newItem);
    });
  }

  removeObject(rowIndex) {
    const tbody = this.table.querySelector("tbody");
    const rowToRemove = tbody.rows[rowIndex];
    const rowData = this.getObject(rowIndex);
    const index = rowIndex;
    rowToRemove.remove();
    this.obj.rows.splice(rowIndex, 1);
    const newItem = { index: index, data: rowData };
    this.callbacks.remove.forEach((callback) => {
      callback(newItem);
    });
  }

  items() {
    const tableData = [];
    const rows = this.table.querySelectorAll("tbody tr"); //tbodydeki tüm satırlar
    rows.forEach((row) => {
      const rowData = [];
      const cells = row.querySelectorAll("td"); //satırdaki listedi tüm bilgiler
      cells.forEach((cell) => {
        rowData.push(cell.textContent); //bilgileri rowdataya at
      });
      tableData.push(rowData); //rowdatayı tabledataya at
    });
    return tableData;
  }
  getObject(rowIndex) {
    const row = this.table.querySelector(
      `tbody tr:nth-of-type(${rowIndex + 1})`
    );
    const rowData = [];
    const cells = row.querySelectorAll("td");
    cells.forEach((cell) => {
      rowData.push(cell.textContent);
    });
    return rowData;
  }
  on(eventName, callback) {
    this.callbacks[eventName].push(callback);
  }

  sortTable(columnIndex) {
    const tableBody = this.table.querySelector("tbody");
    const rows = Array.from(tableBody.querySelectorAll("tr")); //tüm rowlar

    rows.sort((a, b) => {
      const cellA = a.querySelectorAll("td")[columnIndex].textContent;
      const cellB = b.querySelectorAll("td")[columnIndex].textContent;

      if (cellA < cellB) {
        return -1;
      } else if (cellA > cellB) {
        return 1;
      } else {
        return 0;
      }
    });
    rows.forEach((row) => tableBody.appendChild(row));
  }
}
