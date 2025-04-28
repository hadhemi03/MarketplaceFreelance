import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['new_project', 'new_message', 'task_added', 'task_completed'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null, // not always linked to a project (ex: message notification could be independent)
    },
    read: {
      type: Boolean,
      default: false, // mark if the user has seen the notification
    },
  },
  { timestamps: true } // createdAt, updatedAt automatically
);

export default mongoose.model('Notification', NotificationSchema);
