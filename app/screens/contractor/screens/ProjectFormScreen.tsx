import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";

import { ContractorPage } from "@/app/screens/contractor/components/ContractorPage";
import { ContractorSectionHeader } from "@/app/screens/contractor/components/ContractorSectionHeader";
import { useContractorSession } from "@/app/screens/contractor/hooks/useContractorSession";
import {
  createProject,
  fetchProjectById,
  updateProject,
} from "@/services/projectsApi";

export function ContractorProjectFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ project_id?: string | string[] }>();
  const { accessToken } = useContractorSession();
  const projectId = Array.isArray(params.project_id)
    ? params.project_id[0]
    : params.project_id;
  const isEditing = Boolean(projectId);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState({
    budget: "",
    description: "",
    end_date: "",
    location: "",
    name: "",
    progress: "",
    start_date: "",
  });

  useEffect(() => {
    if (!accessToken || !projectId) {
      return;
    }

    let isMounted = true;

    void fetchProjectById(accessToken, projectId)
      .then((project) => {
        if (!isMounted) {
          return;
        }

        setValues({
          budget: project.budget ? String(project.budget) : "",
          description: project.description ?? "",
          end_date: project.end_date ?? "",
          location: project.location ?? "",
          name: project.name,
          progress:
            typeof project.progress === "number" ? String(project.progress) : "",
          start_date: project.start_date ?? "",
        });
      })
      .catch((loadError) => {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load project details.",
        );
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [accessToken, projectId]);

  const handleChange = (field: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async () => {
    if (!accessToken || isSaving) {
      return;
    }

    if (!values.name.trim()) {
      setError("Project name is required.");
      return;
    }

    setError(null);
    setIsSaving(true);

    const payload = {
      budget: values.budget ? Number(values.budget) : undefined,
      description: values.description.trim() || undefined,
      end_date: values.end_date.trim() || undefined,
      location: values.location.trim() || undefined,
      name: values.name.trim(),
      progress: values.progress ? Number(values.progress) : undefined,
      start_date: values.start_date.trim() || undefined,
      status: "active" as const,
    };

    try {
      const project =
        isEditing && projectId
          ? await updateProject(accessToken, projectId, payload)
          : await createProject(accessToken, payload);

      router.replace({
        pathname: "/project-detail",
        params: { project_id: project.id },
      });
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Unable to save project.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ContractorPage>
      <ContractorSectionHeader
        subtitle="Capture the essentials for site-based material planning. Use ISO dates such as 2026-05-01."
        title={isEditing ? "Edit Project" : "Create Project"}
      />

      <View className="rounded-[30px] bg-white p-5">
        {isLoading ? (
          <View className="py-8">
            <ActivityIndicator color="#0A2238" />
          </View>
        ) : (
          <View className="gap-4">
            {[
              ["name", "Project Name", "North Wing Retrofit"],
              ["location", "Location", "Cebu City, Lot 18"],
              ["start_date", "Start Date", "2026-05-01"],
              ["end_date", "End Date", "2026-08-30"],
              ["progress", "Progress (%)", "42"],
              ["budget", "Budget", "2500000"],
            ].map(([field, label, placeholder]) => (
              <View key={field}>
                <Text className="mb-2 text-[10px] font-black uppercase tracking-[2px] text-neutral-500">
                  {label}
                </Text>
                <TextInput
                  className="rounded-[20px] bg-[#F3F5F7] px-4 py-4 text-base font-semibold text-primary-900"
                  onChangeText={(value) =>
                    handleChange(field as keyof typeof values, value)
                  }
                  placeholder={placeholder}
                  placeholderTextColor="#94A3B8"
                  value={values[field as keyof typeof values]}
                />
              </View>
            ))}

            <View>
              <Text className="mb-2 text-[10px] font-black uppercase tracking-[2px] text-neutral-500">
                Description
              </Text>
              <TextInput
                className="min-h-[120px] rounded-[20px] bg-[#F3F5F7] px-4 py-4 text-base font-semibold text-primary-900"
                multiline
                onChangeText={(value) => handleChange("description", value)}
                placeholder="Scope, delivery restrictions, staging notes..."
                placeholderTextColor="#94A3B8"
                textAlignVertical="top"
                value={values.description}
              />
            </View>

            {error ? (
              <View className="rounded-[18px] bg-rose-50 px-4 py-3">
                <Text className="text-sm font-semibold text-rose-700">{error}</Text>
              </View>
            ) : null}

            <View className="flex-row gap-3">
              <Pressable
                className="flex-1 items-center rounded-[20px] bg-primary-900 px-4 py-4 active:bg-primary-800"
                onPress={() => void handleSave()}
              >
                <Text className="text-xs font-black uppercase tracking-[2px] text-white">
                  {isSaving ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
                </Text>
              </Pressable>
              <Pressable
                className="items-center rounded-[20px] border border-neutral-300 px-4 py-4 active:bg-neutral-100"
                onPress={() => router.back()}
              >
                <Text className="text-xs font-black uppercase tracking-[2px] text-primary-900">
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </ContractorPage>
  );
}
