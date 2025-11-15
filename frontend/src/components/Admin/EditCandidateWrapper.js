import React from "react";
import { useParams } from "react-router-dom";
import EditCandidate from "./EditCandidate";

export default function EditCandidateWrapper() {
  const { candidateId } = useParams();
  return <EditCandidate candidateId={candidateId} />;
}
