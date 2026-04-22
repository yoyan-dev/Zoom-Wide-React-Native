import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { ContractorEmptyState } from "@/app/screens/contractor/components/ContractorEmptyState";
import { ContractorPage } from "@/app/screens/contractor/components/ContractorPage";
import { ContractorSectionHeader } from "@/app/screens/contractor/components/ContractorSectionHeader";
import { ProjectCard } from "@/app/screens/contractor/components/ProjectCard";
import { useContractorSession } from "@/app/screens/contractor/hooks/useContractorSession";
import { fetchProjects } from "@/services/projectsApi";
import type { Project } from "@/types/project";

export function ContractorProjectsScreen() {
  const router = useRouter();
  const { accessToken, customer } = useContractorSession();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  const loadProjects = useCallback(async () => {
    if (!accessToken || !customer?.id) {
      setError("Sign in with a contractor account to manage projects.");
      setIsLoading(false);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      setProjects(await fetchProjects(accessToken, { limit: 50 }));
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load projects.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, customer?.id]);

  useFocusEffect(
    useCallback(() => {
      void loadProjects();
    }, [loadProjects]),
  );

  return (
    <ContractorPage>
      <ContractorSectionHeader
        actionLabel="+ Add Project"
        onAction={() => router.push("/project-form")}
        subtitle="Every contractor order should roll up to a live site for cleaner purchasing and delivery visibility."
        title="Projects"
      />

      {isLoading ? (
        <View className="rounded-[28px] bg-white p-8">
          <ActivityIndicator color="#0A2238" />
        </View>
      ) : error ? (
        <ContractorEmptyState
          actionLabel="Retry"
          description={error}
          onAction={() => void loadProjects()}
          title="Project list unavailable"
        />
      ) : projects.length === 0 ? (
        <ContractorEmptyState
          actionLabel="Create Project"
          description="Add your first project before preparing a bulk order."
          onAction={() => router.push("/project-form")}
          title="No projects found"
        />
      ) : (
        <View className="gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              onPress={() =>
                router.push({
                  pathname: "/project-detail",
                  params: { project_id: project.id },
                })
              }
              project={project}
            />
          ))}
        </View>
      )}
    </ContractorPage>
  );
}
