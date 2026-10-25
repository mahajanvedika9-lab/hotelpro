import React, { useState, useEffect } from 'react';
import TaskModal from '../components/TaskModal';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Wrench, 
  Filter, 
  RotateCcw,
  ArrowRight 
} from 'lucide-react';

const HousekeepingPage = () => {
  const { isStaff } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      let taskUrl = '/api/tasks?';
      if (statusFilter !== 'All') taskUrl += `status=${statusFilter}&`;
      if (priorityFilter !== 'All') taskUrl += `priority=${priorityFilter}&`;

      const [resTasks, resRooms] = await Promise.all([
        fetch(taskUrl),
        fetch('/api/rooms'),
      ]);

      const dataTasks = await resTasks.json();
      const dataRooms = await resRooms.json();

      if (dataTasks.success) setTasks(dataTasks.tasks);
      if (dataRooms.success) setRooms(dataRooms.rooms);

      setLoading(false);
    } catch (err) {
      console.error('Housekeeping fetch error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, priorityFilter]);

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh to update tasks and room statuses
        fetchData();
      }
    } catch (err) {
      console.error('Update task status error:', err);
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return <span className="badge badge-urgent">Urgent</span>;
      case 'High':
        return <span className="badge badge-high">High</span>;
      case 'Medium':
        return <span className="badge badge-medium">Medium</span>;
      case 'Low':
        return <span className="badge badge-low">Low</span>;
      default:
        return <span className="badge bg-secondary">{priority}</span>;
    }
  };

  const pendingTasks = tasks.filter((t) => t.status === 'Pending');
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress');
  const completedTasks = tasks.filter((t) => t.status === 'Completed');

  return (
    <div className="container py-4 py-lg-5">
      {/* Title */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge bg-warning-subtle text-gold border border-warning px-3 py-1 mb-2">
            OPERATIONAL TURNOVER & SANITIZATION
          </span>
          <h2 className="text-white font-serif mb-1">Housekeeping & Maintenance</h2>
          <p className="text-secondary small mb-0">
            Real-time room readiness tracking. When rooms are cleaned and verified, they automatically return to live inventory.
          </p>
        </div>

        {isStaff && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn btn-gold d-flex align-items-center gap-2 align-self-start align-self-md-auto"
          >
            <Plus size={18} />
            <span>Dispatch New Service Task</span>
          </button>
        )}
      </div>

      {/* Priority Filters */}
      <div className="d-flex gap-2 flex-wrap mb-4">
        <span className="text-secondary small align-self-center me-2">Priority Filter:</span>
        {['All', 'Urgent', 'High', 'Medium', 'Low'].map((pr) => (
          <button
            key={pr}
            onClick={() => setPriorityFilter(pr)}
            className={`btn btn-sm ${priorityFilter === pr ? 'btn-gold' : 'btn-glass text-secondary'}`}
          >
            {pr}
          </button>
        ))}
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-gold mb-3" role="status"></div>
          <div className="text-secondary">Loading housekeeping board...</div>
        </div>
      ) : (
        <div className="row g-4">
          {/* Pending Column */}
          <div className="col-12 col-lg-4">
            <div className="glass-card p-3 h-100">
              <div className="d-flex justify-content-between align-items-center pb-2 border-bottom border-secondary mb-3">
                <span className="text-white fw-bold d-flex align-items-center gap-2">
                  <Clock size={16} className="text-warning" />
                  <span>Pending Queue</span>
                </span>
                <span className="badge bg-dark text-warning border border-warning">{pendingTasks.length}</span>
              </div>

              <div className="d-flex flex-column gap-3">
                {pendingTasks.map((t) => (
                  <div key={t._id} className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-black text-gold border border-warning px-2 py-1 small">
                        Room #{t.roomNumber}
                      </span>
                      {getPriorityBadge(t.priority)}
                    </div>
                    <div className="text-white fw-semibold small mb-1">{t.title}</div>
                    <p className="text-secondary small mb-2">{t.notes || 'Routine service protocol.'}</p>
                    <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
                      <small className="text-dim">Assignee: {t.assignedTo}</small>
                      <button 
                        onClick={() => handleUpdateStatus(t._id, 'In Progress')}
                        className="btn btn-sm btn-outline-warning py-0 px-2 small"
                      >
                        Start <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                {pendingTasks.length === 0 && (
                  <div className="text-center py-4 text-secondary small">No pending tasks.</div>
                )}
              </div>
            </div>
          </div>

          {/* In Progress Column */}
          <div className="col-12 col-lg-4">
            <div className="glass-card p-3 h-100">
              <div className="d-flex justify-content-between align-items-center pb-2 border-bottom border-secondary mb-3">
                <span className="text-white fw-bold d-flex align-items-center gap-2">
                  <Sparkles size={16} className="text-info" />
                  <span>In Progress</span>
                </span>
                <span className="badge bg-dark text-info border border-info">{inProgressTasks.length}</span>
              </div>

              <div className="d-flex flex-column gap-3">
                {inProgressTasks.map((t) => (
                  <div key={t._id} className="p-3 rounded-3" style={{ background: 'rgba(56, 189, 248, 0.04)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-black text-gold border border-warning px-2 py-1 small">
                        Room #{t.roomNumber}
                      </span>
                      {getPriorityBadge(t.priority)}
                    </div>
                    <div className="text-white fw-semibold small mb-1">{t.title}</div>
                    <p className="text-secondary small mb-2">{t.notes || 'Routine service protocol.'}</p>
                    <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
                      <small className="text-dim">{t.assignedTo}</small>
                      <button 
                        onClick={() => handleUpdateStatus(t._id, 'Completed')}
                        className="btn btn-sm btn-success py-0 px-2 small d-flex align-items-center gap-1"
                      >
                        <CheckCircle2 size={12} />
                        <span>Complete & Release</span>
                      </button>
                    </div>
                  </div>
                ))}
                {inProgressTasks.length === 0 && (
                  <div className="text-center py-4 text-secondary small">No tasks currently in progress.</div>
                )}
              </div>
            </div>
          </div>

          {/* Completed Column */}
          <div className="col-12 col-lg-4">
            <div className="glass-card p-3 h-100">
              <div className="d-flex justify-content-between align-items-center pb-2 border-bottom border-secondary mb-3">
                <span className="text-white fw-bold d-flex align-items-center gap-2">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Sanitized & Ready</span>
                </span>
                <span className="badge bg-dark text-success border border-success">{completedTasks.length}</span>
              </div>

              <div className="d-flex flex-column gap-3">
                {completedTasks.slice(0, 6).map((t) => (
                  <div key={t._id} className="p-3 rounded-3 opacity-75" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <span className="badge bg-black text-secondary px-2 py-1 small">
                        Room #{t.roomNumber}
                      </span>
                      <span className="badge bg-success-subtle text-success small">Verified</span>
                    </div>
                    <div className="text-secondary text-decoration-line-through small">{t.title}</div>
                    <small className="text-dim d-block mt-1">Completed by {t.assignedTo}</small>
                  </div>
                ))}
                {completedTasks.length === 0 && (
                  <div className="text-center py-4 text-secondary small">No completed tasks today.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Creation Modal */}
      {isModalOpen && (
        <TaskModal 
          rooms={rooms}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTaskCreated={() => {
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default HousekeepingPage;
