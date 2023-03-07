class Cell {
  constructor(data, rowIndex, columnIndex) {
    this.data = data;
    this.columnIndex = columnIndex;
    this.rowIndex = rowIndex;
    this.element = null;
  }
  SUM(x) {
    console.log(x, "hm");
    var str = x;
    var nums = str.split(":");
    var num1 = nums[0];
    var num2 = nums[1];
    var first = parseInt(document.querySelector(`.${num1}`).innerText);
    console.log(first, "lala");
    var second = parseInt(document.querySelector(`.${num2}`).innerText);
    let sonuc = first + second;
    return sonuc;
  }
  DIF(x) {
    console.log(x, "hm");
    var str = x;
    var nums = str.split(":");
    var num1 = nums[0];
    var num2 = nums[1];
    var first = parseInt(document.querySelector(`.${num1}`).innerText);
    console.log(first, "lala");
    var second = parseInt(document.querySelector(`.${num2}`).innerText);
    let sonuc = first - second;
    return sonuc;
  }
  render() {
    this.element = document.createElement("td");
    this.element.setAttribute("class", "cell");
    this.element.innerText = this.data;
    this.element.classList.add(
      `${String.fromCharCode(65 + this.columnIndex)}${this.rowIndex}`
    ); //A1 C2 gibi isimlendirme

    this.element.addEventListener("dblclick", () => {
      const input = document.createElement("input");
      input.value = this.data;
      const old = this.data;
      input.addEventListener("blur", () => {
        this.data = input.value;
        if (this.data.startsWith("=")) {
          var data = this.data.slice(1); //SUM(14:20)
          var str = data;
          str = str.replace(/\b([A-Z]\d+:[A-Z]\d+)\b/g, function (match) {
            console.log("'" + match + "'");
            return "'" + match + "'";
          });
          this.element.innerText = eval(`this.${str}`);
          //OBJEDE güncelle
        } else {
          this.element.innerText = this.data;
        }

        const event = new CustomEvent("data-updated", {
          detail: {
            newData: this.data,
            oldData: old,
          },
        });
        this.element.dispatchEvent(event); //elemente event eklendi
      });
      this.element.innerText = "";
      this.element.appendChild(input);
      input.focus();
    });
    return this.element;
  }
}
