"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileReader = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const fileReader = (filePath) => {
    return new Promise((resolve, reject) => {
        const addresses = [];
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)())
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
};
exports.fileReader = fileReader;
