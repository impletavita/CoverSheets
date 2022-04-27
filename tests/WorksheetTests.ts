function constructorParameterCannotBeNull() {
  try {
    const newWorksheet = new CoverSheets.Worksheet("DoesNotExist");
  } catch(e) {
    CoverSheets.CSUtils.log(e as string, "Toast");
  }

  Logger.log(CoverSheets.CSUtils.getProperty("User", "Logdata"));
}

function newWorksheet() {
  const newWorksheet = new CoverSheets.Worksheet("Test Sheet");
  Logger.log(newWorksheet.sheet.getName());
}