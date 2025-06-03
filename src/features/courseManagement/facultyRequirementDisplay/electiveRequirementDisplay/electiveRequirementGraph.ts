import { ElectiveRequirement } from '@/types/facultyRequirement';

export type ElectiveRequirementGraph = {
  [key: string]: ElectiveRequirement[];
};

export const generateElectiveRequirementGraph = (
  electiveRequirements: ElectiveRequirement[]
): ElectiveRequirementGraph => {
  const graph: ElectiveRequirementGraph = {};
  electiveRequirements.map((electiveRequirement) => {
    graph[electiveRequirement.electiveRequirementId] = [];
  });
  return electiveRequirements.reduce((graph, requirement) => {
    if (requirement.upperElectiveRequirementId) {
      graph[requirement.upperElectiveRequirementId].push(requirement);
    }
    return graph;
  }, graph as ElectiveRequirementGraph);
};
