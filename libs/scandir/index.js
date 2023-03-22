function scandir (r) {
  const m = {};
  r.keys().forEach(file => {
    const key = file.match(/^\.\/(.+)\.js[on]*$/).pop();
    let oLastBranch = null;
    let oBranch = m;
    let sLastKey = '';
    key.split('/').forEach(b => {
      oLastBranch = oBranch;
      if (!(b in oBranch)) {
        oLastBranch[b] = {};
      }
      sLastKey = b;
      oBranch = oLastBranch[b];
    })
    const oModule = r(file);
    oLastBranch[sLastKey] = 'default' in oModule ? oModule.default : oModule;
  });
  return m;
}

export default scandir;
