import { api } from "./api";

// submit notification for waiter or bill
export const submitNotification = async ({
  type,
  title,
  resto_id,
  table_id,
}) => {
  try {
    const notification = {
      title: title,
      status: type,
      resto_id: resto_id,
      table_id: table_id,
    };

    const res = await api.post("/notifications", notification);

    if (res.data && res.data.success) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Failed to submit notification:", error.message);
    return false;
  }
};
