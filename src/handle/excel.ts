import ExcelJS from "exceljs";

async function saveExcel(data: any): Promise<any> {
  const workbook = new ExcelJS.Workbook();
  const fileName = `${__dirname}/../data/lista-de-booking.xlsx`;

  const sheet = workbook.addWorksheet(`Resultados`);

  const reColumns = [
    { header: "Nombre", key: "name" },
    { header: "Link", key: "link" },
    { header: "Precio", key: "price" },
    { header: "Puntuacion", key: "score" },
    { header: "Categoria", key: "category" },
    { header: "Range Price", key: "range" },
    { header: "CheckIn", key: "checkin" },
    { header: "CheckOut", key: "checkout" }
  ];

  sheet.columns = reColumns;

  sheet.addRows(data);

  workbook.xlsx
    .writeFile(fileName)
    .then((e) => {
      console.log("Creado exitosamente");
    })
    .catch(() => {
      console.log("Algo sucedio guardando el archivo EXCEL");
    });
}

export default saveExcel;
