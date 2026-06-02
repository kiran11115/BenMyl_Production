import React, { useState } from "react";
import { 
    Lock, Shield, Fingerprint, ShieldAlert, 
    Smartphone, Key, History, Globe, 
    Save, RotateCcw, AlertCircle, Info, Trash2, Plus
} from "lucide-react";
import "./SecurityAccess.css";
import ModuleHeader from "../ModuleHeader";

function SecurityAccess() {
    const [ipList, setIpList] = useState(["192.168.1.1", "10.0.0.45", "45.22.11.90"]);
    const [newIp, setNewIp] = useState("");

    const addIp = () => {
        if (newIp && !ipList.includes(newIp)) {
            setIpList([...ipList, newIp]);
            setNewIp("");
        }
    };

    return (
        <div className="security-access-container">
            <ModuleHeader 
                breadcrumb="Security & Access"
                title="Security & Access Control"
                description="Enforce governance policies, manage authentication factors, and set access restrictions."
                badgeText="Platform Security"
                icon={Lock}
                actions={[
                    { 
                        label: "Reset Defaults", 
                        icon: <RotateCcw size={16} />, 
                        type: "secondary",
                        onClick: () => console.log("Reset")
                    },
                    { 
                        label: "Apply Policies", 
                        icon: <Save size={16} />, 
                        type: "primary",
                        onClick: () => console.log("Applied")
                    }
                ]}
            />

            <div className="security-grid">
                <section className="policy-section authenticator">
                    <div className="section-title">
                        <Smartphone size={20} color="#5a5de8" />
                        <h3>Multi-Factor Authentication</h3>
                    </div>
                    <div className="policy-cards">
                        <div className="policy-card">
                            <div className="policy-info">
                                <h5>Enforce MFA for all Admins</h5>
                                <p>Require authenticator app or SMS code for all administrative roles.</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="policy-card">
                            <div className="policy-info">
                                <h5>Email OTP Verification</h5>
                                <p>Mandatory one-time password for every login attempt.</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </section>

                <section className="policy-section passwords">
                    <div className="section-title">
                        <Key size={20} color="#3b82f6" />
                        <h3>Password Policies</h3>
                    </div>
                    <div className="password-rules">
                        <div className="rule-item">
                            <label>Minimum Characters</label>
                            <select defaultValue="12">
                                <option value="8">8 Characters</option>
                                <option value="10">10 Characters</option>
                                <option value="12">12 Characters</option>
                                <option value="16">16 Characters</option>
                            </select>
                        </div>
                        <div className="rule-item">
                            <label>Password Expiration</label>
                            <select defaultValue="90">
                                <option value="30">30 Days</option>
                                <option value="60">60 Days</option>
                                <option value="90">90 Days</option>
                                <option value="0">Never</option>
                            </select>
                        </div>
                        <div className="checkbox-rules">
                            <label><input type="checkbox" defaultChecked /> Require Special Characters</label>
                            <label><input type="checkbox" defaultChecked /> Require Numbers & Mixed Case</label>
                            <label><input type="checkbox" /> Prevent Reusing Last 5 Passwords</label>
                        </div>
                    </div>
                </section>

                <section className="policy-section sessions">
                    <div className="section-title">
                        <History size={20} color="#8b5cf6" />
                        <h3>Session Management</h3>
                    </div>
                    <div className="session-settings">
                        <div className="setting-box">
                            <div className="setting-text">
                                <h5>Session Timeout</h5>
                                <p>Automatically log out inactive users.</p>
                            </div>
                            <div className="input-group">
                                <input type="number" defaultValue="30" />
                                <span>mins</span>
                            </div>
                        </div>
                        <div className="setting-box">
                            <div className="setting-text">
                                <h5>Max Concurrent Sessions</h5>
                                <p>Limit one login per user account.</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </section>

                <section className="policy-section restrictions">
                    <div className="section-title">
                        <Globe size={20} color="#10b981" />
                        <h3>IP Restrictions</h3>
                    </div>
                    <div className="ip-manager">
                        <div className="ip-input-row">
                            <input 
                                type="text" 
                                placeholder="Add IP Address (e.g. 192.168.1.1)" 
                                value={newIp}
                                onChange={(e) => setNewIp(e.target.value)}
                            />
                            <button className="btn-add-ip" onClick={addIp}>
                                <Plus size={18} />
                                Add
                            </button>
                        </div>
                        <div className="ip-list">
                            {ipList.map(ip => (
                                <div key={ip} className="ip-tag">
                                    <span>{ip}</span>
                                    <button onClick={() => setIpList(ipList.filter(i => i !== ip))}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="ip-alert">
                            <AlertCircle size={14} />
                            <span>When enabled, only listed IPs can access the Admin panel.</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default SecurityAccess;
