import child_process from "node:child_process";

const execute = (srcDir, nwPath, argv) => {
  return new Promise((resolve, reject) => {
    const nwProcess = child_process.spawn(nwPath, [srcDir.concat(argv)], {
      detached: true,
      windowsHide: true,
    });

    nwProcess.on("close", () => {
      resolve(0);
    });

    nwProcess.on("error", (error) => {
      console.log(error);
      reject(1);
    });
  });
};

export { execute };
