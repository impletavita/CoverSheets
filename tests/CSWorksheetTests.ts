function constructorParameterCannotBeNull() {
  try {
    const newWorksheet = new CoverSheets.CSWorksheet("DoesNotExist");
  } catch(e) {
    CoverSheets.CSUtils.log(e as string, "Toast");
  }

  Logger.log(CoverSheets.CSUtils.getProperty("User", "Logdata"));
}

function newWorksheet() {
  const newWorksheet = new CoverSheets.CSWorksheet("Test Sheet");
  
}