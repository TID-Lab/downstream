"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const poll_1 = __importDefault(require("./poll"));
class PaginationService extends poll_1.default {
    constructor(lastReportDate) {
        super();
        this.lastReportDate = lastReportDate;
    }
    async fetch() {
        const reports = [...await this.fetchPage()];
        reports.sort((a, b) => a.authoredAt.getTime() - b.authoredAt.getTime());
        for (let i = 0; i < reports.length; i += 1) {
            const report = reports[i];
            if (!this.lastReportDate || this.lastReportDate <= report.authoredAt) {
                this.lastReportDate = report.authoredAt;
            }
            this.enqueue(report);
        }
    }
}
exports.default = PaginationService;
