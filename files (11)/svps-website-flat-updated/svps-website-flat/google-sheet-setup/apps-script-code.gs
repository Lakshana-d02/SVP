/* SVP Systems - Customer Enquiry Logger
   -------------------------------------
   What this does: every time a customer submits the enquiry form on
   the website, their Date, Name, Phone, Address, Product and Note are
   added as a new row in THIS Google Sheet (tab "Customers").

   It also keeps a second tab called "Product Summary" that
   automatically counts how many enquiries each product has received,
   so the owner can see at a glance which products people ask about
   most.

   This sheet is private to your Google account by default - nobody
   else can see it unless you choose to share it. No website visitor
   can ever reach this sheet or this script directly.

   You do not need to understand this code. Just follow the steps in
   SETUP-INSTRUCTIONS.txt to paste this in and get your web link.
*/

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Customers") || ss.insertSheet("Customers");

  // Add header row the first time
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Date", "Name", "Phone", "Address", "Product", "Note"]);
  }

  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.name || "",
    data.phone || "",
    data.address || "",
    data.product || "",
    data.note || ""
  ]);

  updateProductSummary(ss, data.product || "");

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* Keeps a running count of enquiries per product in a "Product Summary" tab.
   The "product" text sent from the site can list more than one item,
   separated by commas (e.g. "Aqua Jade x1, Amaron x2") - each is
   counted separately, ignoring the quantity. */
function updateProductSummary(ss, productText) {
  if (!productText) return;

  var summary = ss.getSheetByName("Product Summary") || ss.insertSheet("Product Summary");
  if (summary.getLastRow() === 0) {
    summary.appendRow(["Product", "Number of enquiries"]);
  }

  var items = productText.split(",");
  for (var i = 0; i < items.length; i++) {
    var raw = items[i].trim();
    if (!raw || raw.indexOf("no specific product") !== -1) continue;

    // Strip a trailing " xN" quantity if present, e.g. "Aqua Jade x2" -> "Aqua Jade"
    var name = raw.replace(/\s*x\d+\s*$/i, "").trim();
    if (!name) continue;

    var found = false;
    var lastRow = summary.getLastRow();
    for (var r = 2; r <= lastRow; r++) {
      if (summary.getRange(r, 1).getValue() === name) {
        var current = summary.getRange(r, 2).getValue() || 0;
        summary.getRange(r, 2).setValue(current + 1);
        found = true;
        break;
      }
    }
    if (!found) {
      summary.appendRow([name, 1]);
    }
  }
}
