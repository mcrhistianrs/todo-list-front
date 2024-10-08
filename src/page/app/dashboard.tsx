import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface TaskList {
  id: string;
  name: string;
  color?: string;
}

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

export function Dashboard() {
  const { userId } = useUserStore();
  const [tasksList, setTasksList] = useState<TaskList[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showTasks, setShowTasks] = useState<boolean>(false);
  const [listName, setListName] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false); // State for list creation popup
  const [showCreateListPopup, setShowCreateListPopup] = useState<boolean>(false); // State for new list popup

  const [previewColor, setPreviewColor] = useState<string | null>(null);

  useEffect(() => {
    handleLoadTaskList();
  }, []);

  useEffect(() => {
    selectedTask = tasksList.find((task) => task.id === selectedTaskId)
  },[selectedTaskId])

  const handleLoadTaskList = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/list/all/${userId}`
      );
      if (response.status === 200) {
        const result = await response.json();
        setTasksList(result);
      }
    } catch (error) {
      console.error("Error loading task list:", error);
    }
  };

  const handleLoadTasks = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/task/all/${selectedTaskId}`
      );
      if (response.status === 200) {
        const result = await response.json();
        setTasks(result);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const handleListName = (name: string) => {
    setListName(name);
  };

  let selectedTask = tasksList.find((task) => task.id === selectedTaskId);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const taskListForm = z.object({
    name: z.string().min(1),
    id: z.number(),
    color: z.string()
  });
  type TaskListForm = z.infer<typeof taskListForm>;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TaskListForm>();

  async function handleTaskForm(data: TaskListForm) {
    const taskId = selectedTaskId;
    const formData = {
      ...data,
      //@ts-expect-error("color is required")
      color: previewColor ?? selectedTask.color,
      id: taskId,
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_URL}/list`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.status === 200) {
        const result = await response.json();
        if (result.name === formData.name) {
          toast.success("Salvo com sucesso!");
          setPreviewColor(null);
          handleLoadTaskList();
          window.location.reload();
        }
      } else {
        toast.error("Erro ao salvar");
      }
    } catch (error) {
      console.error("Error updating task list:", error);
    }
  }

  const handleShowTasks = () => {
    setShowTasks(true);
  };

  const handleToggleStatus = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleChange = (taskId: number, newName: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, name: newName } : task
      )
    );
  };

  const handleDelete = async () => {
    try {
      const taskId = selectedTaskId;
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/list/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Deletado com sucesso!");
        setSelectedTaskId(null);
        setListName("");
      } else {
        toast.error("Erro ao deletar");
      }
    } catch (error) {
      console.error("Error deleting task list:", error);
    }
  };

  const handleCreateTask = async (taskName: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_URL}/task/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: taskName, listId: selectedTaskId }),
      });
      if (response.status === 200) {
        toast.success("Task created successfully!");
        setShowPopup(false);
        handleLoadTasks(); // Refresh the tasks list after creation
      } else {
        toast.error("Error creating task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_URL}/task/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        toast.success("Task deleted successfully!");
        handleLoadTasks(); // Refresh tasks after deletion
      } else {
        toast.error("Failed to delete task.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("An error occurred while deleting the task.");
    }
  };

  const handleUpdateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_URL}/task`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: taskId,
          name: updatedTask.name,
          completed: updatedTask.completed,
        }),
      });

      if (response.status === 200) {
        toast.success("Task updated successfully!");
        handleLoadTasks(); // Refresh tasks after update
      } else {
        toast.error("Failed to update task.");
      }
    } catch {
      toast.error("An error occurred while updating the task.");
    }
  };

  const handleColorPreview = (color: string) => {
    setPreviewColor(color); // Set the preview color
  };

  const handleCreateList = async (listName: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_URL}/list/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: listName, user:userId }),
      });
      if (response.status === 200) {
        toast.success("List created successfully!");
        setShowCreateListPopup(false);
        handleLoadTaskList(); // Refresh the list after creation
      } else {
        toast.error("Error creating list");
      }
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };



  return (
    <>
      <Helmet title="Dashboard" />
  
      <div className="grid grid-cols-4 gap-4 flex-1">
        <div className="col-span-3 ">
          <select
            className="w-full p-2 m-2 border border-gray-300 rounded-lg"
            value={selectedTaskId ?? ""}
            onChange={(e) => {
              setSelectedTaskId(e.target.value);
              setShowTasks(false);
              handleLoadTaskList();
            }}
          >
            <option value="">Selecione uma lista</option>
            {tasksList.map((task) => (
              <option key={task.id} value={task.id}>
                {task.name}
              </option>
            ))}
          </select>
          <Button
            className="ml-2 px-4 py-2  text-white rounded-lg"
            onClick={() => setShowCreateListPopup(true)}
          >
            Adicionar Lista
          </Button>
        </div>
      </div>
  
      {selectedTask && (
        <div className={`flex flex-col h-full w-full gap-6 mt-4 ${previewColor != null ? previewColor : selectedTask.color} p-10`}>
          <div className="space-y-4">
            <form onSubmit={handleSubmit(handleTaskForm)} className="space-y-4">
              <div className="space-y-2">
                <Input
                  className="m-2"
                  id="name"
                  type="text"
                  {...register("name")}
                  value={listName !== "" ? listName : selectedTask.name}
                  onChange={(e) => handleListName(e.target.value)}
                />
                <input
                  type="hidden"
                  {...register("id")}
                  value={selectedTask.id}
                />
              </div>
              <div>
                <div className="flex justify-center">
                  <Button className="m-2 bg-stone-500 border-white border-2" type="button" onClick={() => handleColorPreview("bg-stone-500")} />
                  <Button className="m-2 bg-yellow-300 border-white border-2" type="button" onClick={() => handleColorPreview("bg-yellow-300")} />
                  <Button className="m-2 bg-sky-500 border-white border-2" type="button" onClick={() => handleColorPreview("bg-sky-500")} />
                </div>
                <Button
                  disabled={isSubmitting}
                  className="w-full m-2"
                  type="submit"
                >
                  Salvar
                </Button>
              </div>
            </form>
            <Button className="w-full px-4 py-2 m-2" onClick={handleDelete}>
              Deletar
            </Button>
            <Button
              className="w-full px-4 py-2 m-2"
              type="button"
              onClick={togglePopup}
            >
              Criar Tarefas
            </Button>
            <Button
              className="w-full px-4 py-2 m-2"
              type="button"
              onClick={() => {
                handleShowTasks();
                handleLoadTasks();
              }}
            >
              Tarefas
            </Button>
          </div>
  
          {showTasks && (
            <div className="space-y-4 mt-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border border-gray-300 rounded-lg bg-white shadow space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <Input
                      className="m-2"
                      id={`task-name-${task.id}`}
                      type="text"
                      value={task.name}
                      onChange={(e) => handleChange(task.id, e.target.value)}
                    />
                    <label className="flex items-center cursor-pointer">
                      <Input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleStatus(task.id)}
                        className="form-checkbox"
                      />
                    </label>
                  </div>
                  <Button
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 m-2"
                    onClick={() => {
                      handleDeleteTask(task.id.toString());
                      handleLoadTasks();
                    }}
                  >
                    Deletar
                  </Button>
                  <Button
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 m-2"
                    onClick={() => handleUpdateTask(task.id.toString(), { name: task.name, completed: task.completed })}
                  >
                    Salvar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
  
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Criar Nova Tarefa</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const taskName = (e.target as any).taskName.value;
                if (taskName) {
                  handleCreateTask(taskName);
                }
              }}
            >
              <div className="space-y-4">
                <Input
                  id="taskName"
                  name="taskName"
                  type="text"
                  placeholder="Nome da Tarefa"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={togglePopup}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg"
                >
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
  
      {showCreateListPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Criar Nova Lista</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const listName = (e.target as any).listName.value;
                if (listName) {
                  handleCreateList(listName);
                }
              }}
            >
              <div className="space-y-4">
                <Input
                  id="listName"
                  name="listName"
                  type="text"
                  placeholder="Nome da Lista"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={() => setShowCreateListPopup(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg"
                >
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}  