"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Login_1 = __importDefault(require("./frontend/Login"));
function App() {
    const [username, setUsername] = (0, react_1.useState)("");
    const [company, setCompany] = (0, react_1.useState)("");
    const companies = [
        "Central Holdings",
        "Investment Subsidiary",
        "Alpha Asset Management",
        "Beta Securities",
        "Gamma Capital",
        "SafeGuard Insurance",
        "SafeGuard Partners",
        "National Reinsurance",
        "TrustInsure",
        "SecureCover",
        "Insurance Subsidiary",
        "HealthTrust",
        "SureGuarantee",
    ];
    const groups = ["Holding Company", "Group Investment", "Group Insurance"];
    const GroupingCompanies = [
        { group: "Holding Company", company: "Central Holdings" },
        { group: "Group Investment", company: "Investment Subsidiary" },
        { group: "Group Investment", company: "Alpha Asset Management" },
        { group: "Group Investment", company: "Beta Securities" },
        { group: "Group Investment", company: "Gamma Capital" },
        { group: "Group Insurance", company: "SafeGuard Insurance" },
        { group: "Group Insurance", company: "SafeGuard Partners" },
        { group: "Group Insurance", company: "TrustInsure" },
        { group: "Group Insurance", company: "National Reinsurance" },
        { group: "Group Insurance", company: "SecureCover" },
        { group: "Group Insurance", company: "Insurance Subsidiary" },
        { group: "Group Insurance", company: "HealthTrust" },
        { group: "Group Insurance", company: "SureGuarantee" },
    ];
    return (<react_router_dom_1.BrowserRouter>
      <react_router_dom_1.Routes>
        <react_router_dom_1.Route path="/" element={<Login_1.default setUsername={setUsername} setCompany={setCompany} companies={companies} groups={groups} GroupingCompanies={GroupingCompanies}/>}/>
      </react_router_dom_1.Routes>
    </react_router_dom_1.BrowserRouter>);
}
exports.default = App;
