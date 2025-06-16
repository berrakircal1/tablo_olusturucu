document.addEventListener("DOMContentLoaded", function() {
    var yeniSatirDugme = document.getElementById("yeni-satir-dugme");
    var ikinciSatirDugme = document.getElementById("ikinci-satir-ekle-dugme");
    var ucuncuSatirDugme = document.getElementById("ucuncu-satir-dugme");
    var satirSilDugme = document.getElementById("satir-sil-dugme");
    var geriAlDugme = document.getElementById("geri-al-dugme");
    var temizleDugme = document.getElementById("temizle-dugme");
    var hucreBirlestirDugme = document.getElementById("hucre-birlestir-dugme");
    var sutunEkleDugme = document.getElementById("sutun-ekle-dugme");
    var anaBaslikDugme = document.getElementById("ana-baslik-dugme");
    var anaBaslikSatiri = document.getElementById("ana-baslik-satiri");
    var tableBody = document.querySelector(".course-table tbody");
    var hucreSayisiInput = document.getElementById("hucre-sayisi-input");
    var acikGriSatirEkleDugme = document.getElementById("acik-gri-satir-dugme");
    var koyuGriSatirEkleDugme = document.getElementById("koyu-gri-satir-dugme");
    var addRowButton = document.getElementById("add-row-button");
    var selectedCells = [];
    var tableStateStack = [];

    function getCellCount() {
        var cellCount = parseInt(hucreSayisiInput.value);
        if (isNaN(cellCount) || cellCount <= 0) {
            alert("Lütfen geçerli bir hücre sayısı girin.");
            return null;
        }
        return cellCount;
    }

    function saveTableState() {
        var tableState = tableBody.innerHTML;
        tableStateStack.push(tableState);
    }

    function restoreTableState() {
        if (tableStateStack.length > 0) {
            tableStateStack.pop();
            if (tableStateStack.length > 0) {
                tableBody.innerHTML = tableStateStack[tableStateStack.length - 1];
            } else {
                clearTable();
            }
            adjustCellWidths();
        }
    }

    function createEmptyRow() {
        var cellCount = getCellCount();
        if (cellCount !== null) {
            saveTableState();
            var newRow = document.createElement("tr");
            newRow.style.backgroundColor = "#ffffff";
            for (var i = 0; i < cellCount; i++) {
                var newCell = document.createElement("td");
                newCell.contentEditable = true;
                newCell.addEventListener("click", selectCell);
                newRow.appendChild(newCell);
            }
            tableBody.appendChild(newRow);
            adjustCellWidths();
        }
    }
    
    function createLightGrayRow() {
        var cellCount = getCellCount();
        if (cellCount !== null) {
            saveTableState();
            var newRow = document.createElement("tr");
            newRow.style.backgroundColor = "#f2f2f2";
            for (var i = 0; i < cellCount; i++) {
                var newCell = document.createElement("td");
                newCell.contentEditable = true;
                newCell.addEventListener("click", selectCell);
                newRow.appendChild(newCell);
            }
            tableBody.appendChild(newRow);
            adjustCellWidths();
        }
    }
    
    function createDarkGrayRow() {
        var cellCount = getCellCount();
        if (cellCount !== null) {
            saveTableState();
            var newRow = document.createElement("tr");
            newRow.style.backgroundColor = "#bfbfbf";
            for (var i = 0; i < cellCount; i++) {
                var newCell = document.createElement("td");
                newCell.contentEditable = true;
                newCell.addEventListener("click", selectCell);
                newRow.appendChild(newCell);
            }
            tableBody.appendChild(newRow);
            adjustCellWidths();
        }
    }
    

    function createSecondRow() {
        saveTableState();
        var secondRow = document.createElement("tr");
        
        // Tek hücre oluştur
        var subheaderCell = document.createElement("td");
        subheaderCell.setAttribute("colspan", "100"); // Başlık satırındaki hücre sayısı kadar
        subheaderCell.classList.add("subheader-cell"); // Başlık satırı gibi stillendir
        subheaderCell.setAttribute("contenteditable", "true");
        subheaderCell.textContent = "";
        subheaderCell.addEventListener("click", selectCell);
        secondRow.appendChild(subheaderCell);
    
        tableBody.appendChild(secondRow);
    }

    function createCustomRow() {
        var cellCount = getCellCount();
        if (cellCount !== null) {
            saveTableState();
            var customRow = document.createElement("tr");
            customRow.style.height = "25px";
            customRow.style.backgroundColor = "#205867";
            customRow.style.textAlign = "center";

            for (var i = 0; i < cellCount; i++) {
                var newCell = document.createElement("td");
                newCell.contentEditable = true;
                newCell.style.fontWeight = "bolder";
                newCell.style.color = "#ffffff";
                newCell.addEventListener("click", selectCell);
                customRow.appendChild(newCell);
            }

            tableBody.appendChild(customRow);
            adjustCellWidths();
        }
    }

    function removeLastRow() {
        saveTableState();
        var rows = tableBody.getElementsByTagName("tr");
        if (rows.length > 0) {
            tableBody.removeChild(rows[rows.length - 1]);
            adjustCellWidths();
        }
    }

    function clearTable() {
        saveTableState();
        tableBody.innerHTML = "";
        adjustCellWidths();
    }

    function selectCell(event) {
        var cell = event.target;
        if (selectedCells.includes(cell)) {
            cell.style.backgroundColor = "";
            selectedCells = selectedCells.filter(c => c !== cell);
        } else {
            cell.style.backgroundColor = "yellow";
            selectedCells.push(cell);
        }
    }

    function mergeCells() {
        if (selectedCells.length < 2) {
            alert("Lütfen birleştirmek için en az iki hücre seçin.");
            return;
        }

        var firstCell = selectedCells[0];
        var firstRowIndex = firstCell.parentElement.rowIndex;
        var firstColumnIndex = firstCell.cellIndex;

        var sameRow = true;
        var sameColumn = true;

        selectedCells.forEach(cell => {
            if (cell.parentElement.rowIndex !== firstRowIndex) {
                sameRow = false;
            }
            if (cell.cellIndex !== firstColumnIndex) {
                sameColumn = false;
            }
        });

        if (!sameRow && !sameColumn) {
            alert("Lütfen sadece aynı satırdaki veya aynı sütundaki hücreleri seçin.");
            return;
        }

        if (sameRow) {
            var colSpan = selectedCells.length;
            selectedCells.slice(1).forEach(cell => cell.remove());
            firstCell.colSpan = colSpan;
        } else if (sameColumn) {
            var rowSpan = selectedCells.length;
            selectedCells.slice(1).forEach(cell => cell.remove());
            firstCell.rowSpan = rowSpan;
        }

        firstCell.style.backgroundColor = "";
        selectedCells = [];
        saveTableState();
        adjustCellWidths();
    }

    function addColumn() {
        saveTableState();
        var rows = tableBody.querySelectorAll("tr");

        rows.forEach(function(row) {
            var newCell = document.createElement("td");
            newCell.contentEditable = true;
            newCell.addEventListener("click", selectCell);
            row.appendChild(newCell);
        });
        adjustCellWidths();
    }

    function adjustCellWidths() {
        var rows = tableBody.getElementsByTagName("tr");
        for (let i = 0; i < rows.length; i++) {
            var cells = rows[i].getElementsByTagName("td");
            var cellWidth = 100 / cells.length;
            for (let j = 0; j < cells.length; j++) {
                cells[j].style.width = `${cellWidth}%`;
            }
        }
    }
// Satır ekleme butonuna tıklama olayı
addRowButton.addEventListener("click", function() {
    addStyledRow();
});

// Özelliklerle birlikte satır ekleme fonksiyonu
function addStyledRow() {
    // Yeni satır oluştur
    var newRow = document.createElement("tr");
    newRow.style.height = "30px";
    newRow.style.backgroundColor = "#eeece1";

    // İçeriği düzenlemek için div öğesi oluştur
    var cellContent = document.createElement("div");
    cellContent.contentEditable = true;
    cellContent.style.textAlign = "left";
    cellContent.style.paddingLeft = "5px"; // Metnin hücre içinde biraz boşluk bırakması için

    // Metin içeriğini ayarla
    cellContent.textContent = "";
    cellContent.addEventListener("input", function() {
        // Kullanıcının girdiği metni sakla
        this.textContent = this.textContent.trim();
    });

    // Div'i hücreye ekle
    var editableContent = document.createElement("td");
    editableContent.colSpan = "100"; // Satırın tüm hücrelerini kapla
    editableContent.appendChild(cellContent);
    
    // Hücreyi satıra ekle
    newRow.appendChild(editableContent);

    // Tablonun sonuna satırı ekle
    tableBody.appendChild(newRow);
    
    // Tüm satırlardaki hücreler için Enter tuşu olayını yakala
    tableBody.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Enter tuşunun varsayılan davranışını engelle
            var selection = window.getSelection(); // Mevcut seçimi al
            var range = selection.getRangeAt(0); // Seçimin aralığını al
            var br = document.createElement("br"); // Yeni satır oluştur
            range.insertNode(br); // Seçimin olduğu yere yeni satırı ekle
        }
    });
    
}
    
    anaBaslikDugme.addEventListener("click", () => anaBaslikSatiri.style.display = "");
    yeniSatirDugme.addEventListener("click", createEmptyRow);
    ikinciSatirDugme.addEventListener("click", createSecondRow);
    ucuncuSatirDugme.addEventListener("click", createCustomRow);
    satirSilDugme.addEventListener("click", removeLastRow);
    temizleDugme.addEventListener("click", clearTable);
    hucreBirlestirDugme.addEventListener("click", mergeCells);
    sutunEkleDugme.addEventListener("click", addColumn);
    geriAlDugme.addEventListener("click", restoreTableState);
    acikGriSatirEkleDugme.addEventListener("click", createLightGrayRow);
    koyuGriSatirEkleDugme.addEventListener("click", createDarkGrayRow);
    add-row-button.addEventListener("click", addStyledRow);
    
});
