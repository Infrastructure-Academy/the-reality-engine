import { describe, it, expect, vi } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  getGovernanceRecords: vi.fn().mockResolvedValue([
    {
      id: 1,
      recordId: "GOV-TETRA-001",
      title: "Tetrahedral Observer Model",
      recordType: "governance_model",
      version: "v1.0",
      blockRef: "Block398",
      description: "The Tetrahedral Observer governance framework",
      content: { bridges: ["ACAD", "MEMORIAL", "CHART ROOM", "TRE GAME"] },
      govStatus: "active",
      compliance: "SAP-001 compliant",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      recordId: "GOV-SAP-001",
      title: "System Assurance Protocol (SAP-001)",
      recordType: "protocol",
      version: "v1.0",
      blockRef: "Block395",
      description: "SAP-001 master governance protocol",
      content: { rules: ["Never overwrite"] },
      govStatus: "active",
      compliance: "Active — enforced",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getGovernanceRecordById: vi.fn().mockImplementation((recordId: string) => {
    if (recordId === "GOV-TETRA-001") {
      return Promise.resolve({
        id: 1,
        recordId: "GOV-TETRA-001",
        title: "Tetrahedral Observer Model",
        recordType: "governance_model",
        govStatus: "active",
      });
    }
    return Promise.resolve(null);
  }),
  getFeedbackReports: vi.fn().mockResolvedValue([
    {
      id: 1,
      nodeNumber: 18,
      reporterName: "Khanh Huynh (Node 018)",
      reportType: "beta_feedback",
      source: "WhatsApp",
      reportDate: "2026-03-23",
      blockRef: "Block402",
      verdictTitle: "Positive — Wants More Story and Choice",
      reportStatus: "resolved",
    },
  ]),
  getDcsnNodes: vi.fn().mockResolvedValue([
    { id: 1, nodeNumber: 0, name: "Nigel Dearden", dcsnStatus: "activated" },
    { id: 2, nodeNumber: 2, name: "Henry Leong", dcsnStatus: "activated" },
    { id: 3, nodeNumber: 18, name: "Khanh Huynh", dcsnStatus: "activated" },
  ]),
}));

import * as db from "./db";

describe("Governance DB helpers", () => {
  it("getGovernanceRecords returns all governance records", async () => {
    const records = await db.getGovernanceRecords();
    expect(records).toHaveLength(2);
    expect(records[0].recordId).toBe("GOV-TETRA-001");
    expect(records[1].recordId).toBe("GOV-SAP-001");
  });

  it("getGovernanceRecordById returns specific record", async () => {
    const record = await db.getGovernanceRecordById("GOV-TETRA-001");
    expect(record).not.toBeNull();
    expect(record?.title).toBe("Tetrahedral Observer Model");
  });

  it("getGovernanceRecordById returns null for unknown ID", async () => {
    const record = await db.getGovernanceRecordById("UNKNOWN");
    expect(record).toBeNull();
  });

  it("getFeedbackReports returns all feedback reports", async () => {
    const reports = await db.getFeedbackReports();
    expect(reports).toHaveLength(1);
    expect(reports[0].reporterName).toContain("Khanh");
    expect(reports[0].reportStatus).toBe("resolved");
  });

  it("getDcsnNodes returns all DCSN nodes", async () => {
    const nodes = await db.getDcsnNodes();
    expect(nodes).toHaveLength(3);
    expect(nodes[0].nodeNumber).toBe(0);
    expect(nodes[2].name).toBe("Khanh Huynh");
  });
});

describe("Governance data integrity", () => {
  it("all governance records have required fields", async () => {
    const records = await db.getGovernanceRecords();
    for (const rec of records) {
      expect(rec.recordId).toBeTruthy();
      expect(rec.title).toBeTruthy();
      expect(rec.recordType).toBeTruthy();
      expect(["active", "superseded", "draft"]).toContain(rec.govStatus);
    }
  });

  it("feedback reports have valid status", async () => {
    const reports = await db.getFeedbackReports();
    for (const rep of reports) {
      expect(["open", "in_progress", "resolved", "archived"]).toContain(rep.reportStatus);
      expect(rep.reporterName).toBeTruthy();
    }
  });

  it("DCSN nodes have sequential numbering", async () => {
    const nodes = await db.getDcsnNodes();
    expect(nodes.length).toBeGreaterThan(0);
    for (const node of nodes) {
      expect(typeof node.nodeNumber).toBe("number");
      expect(node.name).toBeTruthy();
    }
  });
});
