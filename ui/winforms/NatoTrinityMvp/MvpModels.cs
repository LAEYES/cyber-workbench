using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace NatoTrinityMvp;

public sealed record MvpRisk(
  // Align with OpenAPI/JSON schemas: envelope fields
  [property: JsonPropertyName("id")] string Id = "",
  [property: JsonPropertyName("type")] string Type = "risk",
  [property: JsonPropertyName("version")] int Version = 1,
  [property: JsonPropertyName("createdAt")] string CreatedAt = "",
  [property: JsonPropertyName("createdBy")] string CreatedBy = "",
  [property: JsonPropertyName("updatedAt")] string UpdatedAt = "",

  // Store-scoped metadata (extra; allowed by JSON schema additionalProperties)
  [property: JsonPropertyName("orgId")] string OrgId = "",

  // Domain fields
  [property: JsonPropertyName("riskId")] string RiskId = "",
  [property: JsonPropertyName("title")] string Title = "",
  [property: JsonPropertyName("description")] string? Description = null,
  [property: JsonPropertyName("owner")] string Owner = "",
  [property: JsonPropertyName("likelihood")] int Likelihood = 1,
  [property: JsonPropertyName("impact")] int Impact = 1,
  [property: JsonPropertyName("score")] int Score = 1,
  [property: JsonPropertyName("status")] string Status = "open",
  [property: JsonPropertyName("dueDate")] string DueDate = "",

  [property: JsonPropertyName("controlRefs")] string[]? ControlRefs = null,
  [property: JsonPropertyName("evidenceRefs")] string[]? EvidenceRefs = null,
  [property: JsonPropertyName("caseRefs")] string[]? CaseRefs = null,

  // Local convenience field (not in OpenAPI/JSON schema)
  [property: JsonPropertyName("updatedBy")] string UpdatedBy = ""
);

public sealed record MvpDecision(
  [property: JsonPropertyName("id")] string Id = "",
  [property: JsonPropertyName("type")] string Type = "decision",
  [property: JsonPropertyName("version")] int Version = 1,
  [property: JsonPropertyName("createdAt")] string CreatedAt = "",
  [property: JsonPropertyName("createdBy")] string CreatedBy = "",

  [property: JsonPropertyName("orgId")] string OrgId = "",

  [property: JsonPropertyName("decisionId")] string DecisionId = "",
  [property: JsonPropertyName("riskId")] string RiskId = "",
  [property: JsonPropertyName("decisionType")] string DecisionType = "",
  [property: JsonPropertyName("rationale")] string Rationale = "",
  [property: JsonPropertyName("approvedBy")] string ApprovedBy = "",
  [property: JsonPropertyName("approvedAt")] string ApprovedAt = "",
  [property: JsonPropertyName("expiryDate")] string? ExpiryDate = null,
  [property: JsonPropertyName("evidenceRefs")] string[]? EvidenceRefs = null
);

public sealed record MvpCase(
  [property: JsonPropertyName("id")] string Id = "",
  [property: JsonPropertyName("type")] string Type = "case",
  [property: JsonPropertyName("version")] int Version = 1,
  [property: JsonPropertyName("createdAt")] string CreatedAt = "",
  [property: JsonPropertyName("createdBy")] string CreatedBy = "",
  [property: JsonPropertyName("updatedAt")] string UpdatedAt = "",

  [property: JsonPropertyName("orgId")] string OrgId = "",

  [property: JsonPropertyName("caseId")] string CaseId = "",
  [property: JsonPropertyName("severity")] string Severity = "",
  [property: JsonPropertyName("status")] string Status = "",
  [property: JsonPropertyName("owner")] string Owner = "",

  // Spec uses riskRefs (array); MVP UI supplies a single riskId
  [property: JsonPropertyName("riskRefs")] string[]? RiskRefs = null,
  [property: JsonPropertyName("timelineRefs")] string[]? TimelineRefs = null,
  [property: JsonPropertyName("evidenceRefs")] string[]? EvidenceRefs = null,

  [property: JsonPropertyName("triagedAt")] string? TriagedAt = null,
  [property: JsonPropertyName("containedAt")] string? ContainedAt = null,
  [property: JsonPropertyName("closedAt")] string? ClosedAt = null,

  // Local convenience field (not in OpenAPI/JSON schema)
  [property: JsonPropertyName("updatedBy")] string UpdatedBy = ""
);

public sealed record MvpEvidence(
  [property: JsonPropertyName("id")] string Id = "",
  [property: JsonPropertyName("type")] string Type = "evidence",
  [property: JsonPropertyName("version")] int Version = 1,
  [property: JsonPropertyName("createdAt")] string CreatedAt = "",
  [property: JsonPropertyName("createdBy")] string CreatedBy = "",
  [property: JsonPropertyName("updatedAt")] string UpdatedAt = "",

  [property: JsonPropertyName("orgId")] string OrgId = "",

  [property: JsonPropertyName("evidenceId")] string EvidenceId = "",
  [property: JsonPropertyName("evidenceType")] string EvidenceType = "report",
  [property: JsonPropertyName("sourceSystem")] string SourceSystem = "winforms-mvp",
  [property: JsonPropertyName("collectedAt")] string CollectedAt = "",
  [property: JsonPropertyName("collectorId")] string CollectorId = "",

  [property: JsonPropertyName("hash")] string Hash = "",
  [property: JsonPropertyName("hashAlg")] string HashAlg = "sha256",
  [property: JsonPropertyName("storageRef")] string StorageRef = "",

  [property: JsonPropertyName("retentionClass")] string RetentionClass = "standard",
  [property: JsonPropertyName("classification")] string Classification = "internal",
  [property: JsonPropertyName("metadata")] Dictionary<string, object?>? Metadata = null
);

public sealed record MvpChainOfCustodyEventBase(
  string Id,
  string Type,
  int Version,
  string CreatedAt,
  string CreatedBy,
  string EventId,
  string EvidenceId,
  string Action,
  string Actor,
  string Timestamp,
  string PrevHash,
  string HashAlg,
  string? Location,
  Dictionary<string, object?>? Details
);

public sealed record MvpChainOfCustodyEvent(MvpChainOfCustodyEventBase Base, string EventHash);

public sealed record MvpAuditEvent(
  [property: JsonPropertyName("eventId")] string EventId,
  [property: JsonPropertyName("orgId")] string OrgId,
  [property: JsonPropertyName("actor")] string Actor,
  [property: JsonPropertyName("actorType")] string ActorType,
  [property: JsonPropertyName("action")] string Action,
  [property: JsonPropertyName("objectRef")] string ObjectRef,
  [property: JsonPropertyName("timestamp")] string Timestamp,
  [property: JsonPropertyName("outcome")] string Outcome,
  [property: JsonPropertyName("requestId")] string RequestId
);
