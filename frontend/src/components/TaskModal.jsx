import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';

const TaskModal = ({ rooms, isOpen, onClose, onTaskCreated }) => {
  const [roomId, setRoomId] = useState(rooms?.[0]?._id || '');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Cleaning');
  const [priority, setPriority] = useState('High');
  const [assignedTo, setAssignedTo] = useState('Housekeeping Team');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomId || !title) {
      setError('Please select a room and provide a task title');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          title,
          type,
          priority,
          assignedTo,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create task');

      setLoading(false);
      if (onTaskCreated) onTaskCreated(data.task);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ background: 'rgba(0, 0, 0, 0.82)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
    >
      <div 
        className="modal-content-glass p-4 p-md-5 position-relative w-100" 
        style={{ maxWidth: '520px' }}
      >
        <button 
          onClick={onClose} 
          className="btn btn-sm btn-glass position-absolute top-0 end-0 m-3 text-secondary"
        >
          <X size={20} />
        </button>

        <div className="d-flex align-items-center gap-2 mb-2">
          <Sparkles size={22} className="text-gold" />
          <h3 className="text-white font-serif mb-0">New Housekeeping / Service Task</h3>
        </div>
        <p className="text-secondary small mb-3">
          Dispatch cleaning, linen change, or maintenance actions directly to the floor team.
        </p>

        {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label text-secondary small mb-1">Target Room *</label>
            <select 
              className="form-select form-select-custom"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
            >
              <option value="">Select Room...</option>
              {rooms.map((r) => (
                <option key={r._id} value={r._id}>
                  Room #{r.roomNumber} - {r.name} ({r.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label text-secondary small mb-1">Task Title *</label>
            <input 
              type="text" 
              className="form-control form-control-custom"
              placeholder="e.g. Deep sanitation and mini-bar restocking"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="row g-3">
            <div className="col-6">
              <label className="form-label text-secondary small mb-1">Task Category</label>
              <select 
                className="form-select form-select-custom"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Cleaning">Cleaning</option>
                <option value="Linen Change">Linen Change</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inspection">Inspection</option>
                <option value="Restock Mini Bar">Restock Mini Bar</option>
              </select>
            </div>
            <div className="col-6">
              <label className="form-label text-secondary small mb-1">Priority</label>
              <select 
                className="form-select form-select-custom"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label text-secondary small mb-1">Assigned Personnel</label>
            <input 
              type="text" 
              className="form-control form-control-custom"
              placeholder="e.g. Marcus Vance or Floor 3 Team"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label text-secondary small mb-1">Detailed Instructions / Notes</label>
            <textarea 
              className="form-control form-control-custom"
              rows="2"
              placeholder="Provide specific guest requests or inspection criteria..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="btn btn-glass">
              Cancel
            </button>
            <button type="submit" className="btn btn-gold" disabled={loading}>
              {loading ? 'Creating...' : 'Dispatch Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
