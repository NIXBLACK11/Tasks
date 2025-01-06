import fs from "fs";
import csv from "csv-parser";

export const fileReader = (filePath: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        const addresses: string[] = [];
    
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (row) => {
            if (row.addresses) {
              addresses.push(row.addresses.trim());
            }
          })
          .on("end", () => {
            resolve(addresses);
          })
          .on("error", (error) => {
            reject(error);
          });
    });
}