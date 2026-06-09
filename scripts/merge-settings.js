ObjC.import("Foundation");

function readJson(path, fallback) {
  const manager = $.NSFileManager.defaultManager;
  if (!manager.fileExistsAtPath(path)) {
    return fallback;
  }

  const text = $.NSString.stringWithContentsOfFileEncodingError(
    path,
    $.NSUTF8StringEncoding,
    null
  );

  return JSON.parse(ObjC.unwrap(text));
}

function writeJson(path, value) {
  const text = JSON.stringify(value, null, 2) + "\n";
  const nsText = $(text);
  nsText.writeToFileAtomicallyEncodingError(
    path,
    true,
    $.NSUTF8StringEncoding,
    null
  );
}

function run(argv) {
  const settingsDir = argv[0];

  const pluginsPath = settingsDir + "/plugins.json";
  const plugins = readJson(pluginsPath, {});
  plugins["typora-community-plugin.codeblock-copy-button"] = true;
  writeJson(pluginsPath, plugins);

  const corePath = settingsDir + "/core.json";
  const core = readJson(corePath, { version: 1, settings: {} });
  core.version = core.version || 1;
  core.settings = core.settings || {};
  core.settings.showRibbon = false;
  core.settings.useWorkspace = false;
  core.settings.showFileTabs = false;
  writeJson(corePath, core);
}
