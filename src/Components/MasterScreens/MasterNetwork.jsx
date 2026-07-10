import React, { useState, useEffect, useRef } from "react";
import { 
  Network, 
  Cpu, 
  Database, 
  Mail, 
  HardDrive, 
  Activity, 
  RefreshCw, 
  Play, 
  Flame, 
  Terminal, 
  AlertTriangle,
  CheckCircle,
  X
} from "lucide-react";
import "./MasterNetwork.css";

const initialNodes = [
  { id: "node-api", name: "Core API Gateway", type: "Gateway", status: "Online", latency: "14ms", cpu: "24%", memory: "1.2GB / 4GB", uptime: "99.99%", instances: 3 },
  { id: "node-db", name: "User DB Cluster (Primary)", type: "Database", status: "Online", latency: "4ms", cpu: "12%", memory: "8.4GB / 16GB", uptime: "100%", instances: 2 },
  { id: "node-parser", name: "Core Resume Parser Node", type: "Processing", status: "High Load", latency: "182ms", cpu: "88%", memory: "14.1GB / 16GB", uptime: "99.85%", instances: 5 },
  { id: "node-mail", name: "SMTP Email Router", type: "Utility", status: "Degraded", latency: "65ms", cpu: "45%", memory: "0.8GB / 2GB", uptime: "99.90%", instances: 1 },
  { id: "node-storage", name: "Resume S3 Storage Sync", type: "Storage", status: "Online", latency: "25ms", cpu: "8%", memory: "2.1GB / 8GB", uptime: "99.97%", instances: 2 }
];

const initialLogs = [
  { time: "13:20:05", type: "info", source: "API Gateway", message: "Successfully verified JWT token for client AeroTech" },
  { time: "13:21:12", type: "info", source: "Parser Engine Node", message: "Allocated new worker threads for resume batch #491" },
  { time: "13:22:40", type: "warning", source: "SMTP Email Router", message: "Email delivery timeout alert: retrying message queue #198A" },
  { time: "13:24:15", type: "critical", source: "Parser Engine Node", message: "Memory threshold crossed (> 85%): scaling replica set to 5 instances" },
  { time: "13:25:00", type: "success", source: "DB Cluster", message: "Routine read-replica synchronization completed in 2.1s" }
];

const MasterNetwork = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [logs, setLogs] = useState(initialLogs);
  const [filter, setFilter] = useState("All");
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Incident Form state
  const [isIncidentOpen, setIsIncidentOpen] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: "",
    severity: "Medium",
    affectedNode: "node-api",
    description: ""
  });

  const logEndRef = useRef(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const addLogMessage = (source, message, type = "info") => {
    const time = new Date().toTimeString().split(" ")[0];
    setLogs(prev => [...prev, { time, type, source, message }]);
  };

  const handleRunDiagnostics = (nodeId) => {
    const nodeName = nodes.find(n => n.id === nodeId)?.name || "Node";
    addLogMessage(nodeName, `Initiating diagnostic sequence for host IP: ${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.1.1...`, "info");
    
    setTimeout(() => {
      addLogMessage(nodeName, "Integrity scan results: Codebase matches production hash. Memory usage stable.", "success");
      addLogMessage(nodeName, "Network Latency benchmark: HTTP ping 12ms. Keep-Alive enabled.", "success");
    }, 1000);
  };

  const handleRestartNode = (nodeId) => {
    const nodeName = nodes.find(n => n.id === nodeId)?.name || "Node";
    
    // Set status to degraded temporarily
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: "Offline", latency: "N/A", cpu: "0%" } : n));
    addLogMessage(nodeName, "SIGTERM signal emitted. Shutting down worker processes...", "warning");

    setTimeout(() => {
      addLogMessage(nodeName, "Boot sequence initiated. Mapping static route tables...", "info");
      setTimeout(() => {
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: "Online", latency: "11ms", cpu: "15%" } : n));
        addLogMessage(nodeName, "Service restarted successfully. Health status: ONLINE", "success");
      }, 1000);
    }, 1500);
  };

  const handleTriggerLoadTest = (nodeId) => {
    const nodeName = nodes.find(n => n.id === nodeId)?.name || "Node";
    addLogMessage(nodeName, "Initiating high-concurrency Load Simulation: 10,000 requests / sec...", "warning");
    
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, cpu: "94%", status: "High Load", latency: "380ms" } : n));

    setTimeout(() => {
      addLogMessage(nodeName, "Simulation complete. Cooldown instructions sent to thread group.", "info");
      setTimeout(() => {
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, cpu: "20%", status: "Online", latency: "14ms" } : n));
        addLogMessage(nodeName, "System returned to normal baseline metrics.", "success");
      }, 1500);
    }, 2500);
  };

  const handleCreateIncident = (e) => {
    e.preventDefault();
    if (!newIncident.title || !newIncident.description) {
      alert("Please fill in the incident title and description.");
      return;
    }
    const affected = nodes.find(n => n.id === newIncident.affectedNode);
    
    // Set node status based on severity
    const statusMap = {
      Low: "Degraded",
      Medium: "Degraded",
      High: "High Load",
      Critical: "Offline"
    };

    setNodes(nodes.map(node => {
      if (node.id === newIncident.affectedNode) {
        return {
          ...node,
          status: statusMap[newIncident.severity]
        };
      }
      return node;
    }));

    addLogMessage(affected?.name || "System", `CRITICAL INCIDENT REPORTED: ${newIncident.title} (${newIncident.severity} priority)`, "critical");
    addLogMessage(affected?.name || "System", `Incident details: "${newIncident.description}"`, "warning");
    
    setIsIncidentOpen(false);
    setNewIncident({
      title: "",
      severity: "Medium",
      affectedNode: "node-api",
      description: ""
    });
  };

  const filteredNodes = nodes.filter(node => filter === "All" || node.status === filter);

  const getNodeIcon = (type) => {
    switch (type) {
      case "Gateway": return Network;
      case "Database": return Database;
      case "Utility": return Mail;
      case "Storage": return HardDrive;
      default: return Cpu;
    }
  };

  return (
    <div className="network-container">
      {/* Node Status Summary Grid */}
      <section className="network-filters-row">
        <h2 className="section-title">Telemetry Overview</h2>
        <div className="telemetry-filters">
          {["All", "Online", "High Load", "Degraded", "Offline"].map((opt) => (
            <button 
              key={opt}
              className={`telemetry-filter-btn ${filter === opt ? "active" : ""}`}
              onClick={() => setFilter(opt)}
            >
              {opt}
            </button>
          ))}
          <button className="incident-report-btn" onClick={() => setIsIncidentOpen(true)}>
            <AlertTriangle size={14} />
            <span>Report Outage</span>
          </button>
        </div>
      </section>

      <div className="network-layout-main">
        {/* Nodes Cards list */}
        <div className="nodes-section">
          <div className="nodes-cards-grid">
            {filteredNodes.map((node) => {
              const Icon = getNodeIcon(node.type);
              return (
                <div 
                  key={node.id}
                  className={`node-card ${selectedNode?.id === node.id ? "selected" : ""}`}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className="node-card-top">
                    <div className="node-icon-title">
                      <div className="node-avatar-icon">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4>{node.name}</h4>
                        <span className="node-type-label">{node.type} node</span>
                      </div>
                    </div>
                    <span className={`status-dot-indicator ${node.status.toLowerCase().replace(" ", "-")}`}></span>
                  </div>

                  <div className="node-metrics-summary">
                    <div className="metric-item-small">
                      <span className="metric-lbl">Latency</span>
                      <span className="metric-val">{node.latency}</span>
                    </div>
                    <div className="metric-item-small">
                      <span className="metric-lbl">CPU Load</span>
                      <span className="metric-val">{node.cpu}</span>
                    </div>
                    <div className="metric-item-small">
                      <span className="metric-lbl">Uptime SLA</span>
                      <span className="metric-val">{node.uptime}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Actions details panel */}
        {selectedNode && (
          <aside className="node-action-sidebar">
            <div className="sidebar-header">
              <h3>Node Console</h3>
              <button className="close-btn" onClick={() => setSelectedNode(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="sidebar-body">
              <div className="node-profile">
                <div className="node-avatar-large">
                  {React.createElement(getNodeIcon(selectedNode.type), { size: 30 })}
                </div>
                <h2>{selectedNode.name}</h2>
                <div className="status-indicator-container">
                  <span className={`status-dot-indicator ${selectedNode.status.toLowerCase().replace(" ", "-")}`}></span>
                  <span>{selectedNode.status}</span>
                </div>
              </div>

              <div className="node-telemetry-details">
                <h4>System Telemetry Data</h4>
                <div className="telemetry-row">
                  <span>Host Latency:</span>
                  <strong>{selectedNode.latency}</strong>
                </div>
                <div className="telemetry-row">
                  <span>CPU Usage:</span>
                  <strong>{selectedNode.cpu}</strong>
                </div>
                <div className="telemetry-row">
                  <span>Memory Footprint:</span>
                  <strong>{selectedNode.memory}</strong>
                </div>
                <div className="telemetry-row">
                  <span>Replicas / Nodes:</span>
                  <strong>{selectedNode.instances} instances running</strong>
                </div>
                <div className="telemetry-row">
                  <span>Uptime Score:</span>
                  <strong>{selectedNode.uptime}</strong>
                </div>
              </div>

              <div className="node-controls-section">
                <h4>Cluster Operations</h4>
                <div className="operation-buttons-grid">
                  <button 
                    onClick={() => handleRunDiagnostics(selectedNode.id)}
                    className="console-action-btn diagnostics"
                  >
                    <Activity size={14} />
                    <span>Run Diagnostics</span>
                  </button>
                  <button 
                    onClick={() => handleTriggerLoadTest(selectedNode.id)}
                    className="console-action-btn loadtest"
                  >
                    <Flame size={14} />
                    <span>Simulate Load Test</span>
                  </button>
                  <button 
                    onClick={() => handleRestartNode(selectedNode.id)}
                    className="console-action-btn restart"
                  >
                    <RefreshCw size={14} />
                    <span>Graceful Restart</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Console log outputs terminal */}
      <section className="terminal-logs-section">
        <div className="terminal-header">
          <div className="terminal-title">
            <Terminal size={16} />
            <span>Telemetry & Diagnostic Live Logs</span>
          </div>
          <button className="clear-logs-btn" onClick={() => setLogs([])}>
            Clear Buffer
          </button>
        </div>
        <div className="terminal-body">
          {logs.length === 0 ? (
            <div className="empty-terminal-state">Log stream empty. Action-driven diagnostics output here.</div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className={`log-line-item ${log.type}`}>
                <span className="log-time">[{log.time}]</span>
                <span className="log-source">[{log.source}]</span>
                <span className="log-msg">{log.message}</span>
              </div>
            ))
          )}
          <div ref={logEndRef}></div>
        </div>
      </section>

      {/* Incident Outage Report Modal */}
      {isIncidentOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-top">
              <h3>Report System Incident</h3>
              <button className="close-btn" onClick={() => setIsIncidentOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateIncident} className="modal-form-body">
              <div className="form-input-container">
                <label>Incident Subject Title</label>
                <input 
                  type="text" 
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                  placeholder="e.g. Memory leak / API payload size limits exceeded"
                  required
                />
              </div>

              <div className="form-row-split">
                <div className="form-input-container">
                  <label>Incident Severity</label>
                  <select 
                    value={newIncident.severity}
                    onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value })}
                  >
                    <option value="Low">Low - Minor warning</option>
                    <option value="Medium">Medium - Degraded functionality</option>
                    <option value="High">High - Partial Outage</option>
                    <option value="Critical">Critical - Full Outage / Downtime</option>
                  </select>
                </div>

                <div className="form-input-container">
                  <label>Affected System Node</label>
                  <select 
                    value={newIncident.affectedNode}
                    onChange={(e) => setNewIncident({ ...newIncident, affectedNode: e.target.value })}
                  >
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-input-container">
                <label>Technical Details / Stack Trace Summary</label>
                <textarea 
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  placeholder="Describe the incident error codes, CPU limits triggered or logs..."
                  rows="4"
                  className="incident-textarea-input"
                  required
                />
              </div>

              <div className="modal-footer-row">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setIsIncidentOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit incident">
                  Deploy Alert Outage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterNetwork;
