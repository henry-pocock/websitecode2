const fs_s = require("fs");
const fs = fs_s.promises;

module.exports = {
    readFile: async (filepath, encoding="utf8") => {
        try {
            const buf = await fs.readFile(filepath);
            return buf.toString(encoding);
        } catch (e) {
            return null;
        }
    },
}