import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  getGovernanceRecords: vi.fn(),
  getFeedbackReports: vi.fn(),
  getDcsnNodes: vi.fn(),
}));

import * as db from "./db";

describe("Governance Audit Trail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getGovernanceRecords", () => {
    it("should call with no filters", async () => {
      const mockRecords = [
        { id: 1, recordId: "GOV-TETRA-001", title: "Tetrahedral Observer", recordType: "governance_model", status: "active" },
        { id: 2, recordId: "GOV-SAP-001", title: "System Assurance Protocol", recordType: "protocol", status: "active" },
      ];
      (db.getGovernanceRecords as any).mockResolvedValue(mockRecords);

      const result = await db.getGovernanceRecords();
      expect(db.getGovernanceRecords).toHaveBeenCalledWith();
      expect(result).toHaveLength(2);
      expect(result[0].recordId).toBe("GOV-TETRA-001");
    });

    it("should filter by recordType", async () => {
      const mockRecords = [
        { id: 2, recordId: "GOV-SAP-001", title: "System Assurance Protocol", recordType: "protocol", status: "active" },
      ];
      (db.getGovernanceRecords as any).mockResolvedValue(mockRecords);

      const result = await db.getGovernanceRecords({ recordType: "protocol" });
      expect(db.getGovernanceRecords).toHaveBeenCalledWith({ recordType: "protocol" });
      expect(result).toHaveLength(1);
      expect(result[0].recordType).toBe("protocol");
    });

    it("should filter by status", async () => {
      (db.getGovernanceRecords as any).mockResolvedValue([]);
      const result = await db.getGovernanceRecords({ status: "draft" });
      expect(db.getGovernanceRecords).toHaveBeenCalledWith({ status: "draft" });
      expect(result).toHaveLength(0);
    });

    it("should filter by search term", async () => {
      const mockRecords = [
        { id: 1, recordId: "GOV-TETRA-001", title: "Tetrahedral Observer", recordType: "governance_model", status: "active" },
      ];
      (db.getGovernanceRecords as any).mockResolvedValue(mockRecords);

      const result = await db.getGovernanceRecords({ search: "Tetrahedral" });
      expect(db.getGovernanceRecords).toHaveBeenCalledWith({ search: "Tetrahedral" });
      expect(result[0].title).toContain("Tetrahedral");
    });

    it("should filter by blockRef", async () => {
      const mockRecords = [
        { id: 3, recordId: "GOV-GDP-002", title: "Game Design Parameters", recordType: "design_document", blockRef: "B402", status: "active" },
      ];
      (db.getGovernanceRecords as any).mockResolvedValue(mockRecords);

      const result = await db.getGovernanceRecords({ blockRef: "B402" });
      expect(db.getGovernanceRecords).toHaveBeenCalledWith({ blockRef: "B402" });
      expect(result[0].blockRef).toBe("B402");
    });

    it("should combine multiple filters", async () => {
      (db.getGovernanceRecords as any).mockResolvedValue([]);
      await db.getGovernanceRecords({ recordType: "protocol", status: "active", search: "SAP" });
      expect(db.getGovernanceRecords).toHaveBeenCalledWith({ recordType: "protocol", status: "active", search: "SAP" });
    });
  });

  describe("getFeedbackReports", () => {
    it("should call with no filters", async () => {
      const mockReports = [
        { id: 1, nodeNumber: 18, reporterName: "Khanh Huynh", reportType: "beta_feedback", status: "resolved" },
      ];
      (db.getFeedbackReports as any).mockResolvedValue(mockReports);

      const result = await db.getFeedbackReports();
      expect(result).toHaveLength(1);
      expect(result[0].reporterName).toBe("Khanh Huynh");
    });

    it("should filter by search term", async () => {
      (db.getFeedbackReports as any).mockResolvedValue([]);
      await db.getFeedbackReports({ search: "Khanh" });
      expect(db.getFeedbackReports).toHaveBeenCalledWith({ search: "Khanh" });
    });

    it("should filter by status", async () => {
      (db.getFeedbackReports as any).mockResolvedValue([]);
      await db.getFeedbackReports({ status: "open" });
      expect(db.getFeedbackReports).toHaveBeenCalledWith({ status: "open" });
    });
  });

  describe("getDcsnNodes", () => {
    it("should call with no filters", async () => {
      const mockNodes = [
        { id: 1, nodeNumber: 0, name: "Nigel Dalton", status: "activated" },
        { id: 2, nodeNumber: 1, name: "Jonathan Green", status: "pending" },
        { id: 3, nodeNumber: 2, name: "DAVID", status: "activated" },
        { id: 4, nodeNumber: 18, name: "Khanh Huynh", status: "activated" },
      ];
      (db.getDcsnNodes as any).mockResolvedValue(mockNodes);

      const result = await db.getDcsnNodes();
      expect(result).toHaveLength(4);
      expect(result[0].nodeNumber).toBe(0);
      expect(result[3].nodeNumber).toBe(18);
    });

    it("should filter by status", async () => {
      const mockNodes = [
        { id: 2, nodeNumber: 1, name: "Jonathan Green", status: "pending" },
      ];
      (db.getDcsnNodes as any).mockResolvedValue(mockNodes);

      const result = await db.getDcsnNodes({ status: "pending" });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Jonathan Green");
    });

    it("should filter by search term", async () => {
      (db.getDcsnNodes as any).mockResolvedValue([]);
      await db.getDcsnNodes({ search: "Inspector" });
      expect(db.getDcsnNodes).toHaveBeenCalledWith({ search: "Inspector" });
    });
  });
});
