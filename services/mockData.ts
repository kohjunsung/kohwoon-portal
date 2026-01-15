import { Metric, Task, Report, Payment, ClinicFile, Client, ClinicSettings } from '../types';

// Production Ready Initialization
const INITIAL_CLIENTS: Client[] = [];
const INITIAL_SETTINGS: Record<string, ClinicSettings> = {};
const INITIAL_TASKS: Task[] = [];
const INITIAL_METRICS: Metric[] = [];
const INITIAL_REPORTS: Report[] = [];

// --- Exported Data for Components ---
export const CLIENTS_DATA = INITIAL_CLIENTS;
export const REPORTS_DATA: Report[] = []; 
export const PAYMENTS_DATA: Payment[] = [];
export const FILES_DATA: ClinicFile[] = [];
export const CLINIC_INFO: ClinicSettings = {
    clientId: '',
    name: '',
    representative: '',
    phone: '',
    address: '',
    hours: '',
    lunch: '',
    blogUrl: '',
    placeUrl: '',
    naverId: '',
    naverPw: '',
    philosophy: ''
};

class DataService {
  private clients: Client[] = INITIAL_CLIENTS;
  private tasks: Task[] = INITIAL_TASKS;
  private reports: Report[] = INITIAL_REPORTS;
  private metrics: Record<string, Metric[]> = {}; // Store metrics by Client ID
  private settings: Record<string, ClinicSettings> = INITIAL_SETTINGS;

  // --- Clients ---
  getClients() { return [...this.clients]; }
  
  getClientById(id: string) { return this.clients.find(c => c.id === id); }

  addClient(client: Client) {
    this.clients = [client, ...this.clients];
    // Initialize default settings for new client
    this.settings[client.id] = {
        clientId: client.id,
        name: client.clinicName,
        representative: client.name,
        phone: client.phone,
        address: '',
        hours: '',
        lunch: '',
        blogUrl: '',
        placeUrl: '',
        naverId: '',
        naverPw: '',
        philosophy: ''
    };
    return client;
  }

  updateClient(updatedClient: Client) {
    this.clients = this.clients.map(c => c.id === updatedClient.id ? updatedClient : c);
    return updatedClient;
  }

  deleteClient(id: string) {
    this.clients = this.clients.filter(c => c.id !== id);
  }

  // --- Metrics ---
  getMetrics(clientId: string) {
    return this.metrics[clientId] || INITIAL_METRICS; 
  }

  updateMetric(clientId: string, metric: Metric) {
    if (!this.metrics[clientId]) {
        this.metrics[clientId] = [];
    }
    
    const existingIndex = this.metrics[clientId].findIndex(m => m.month === metric.month);
    if (existingIndex >= 0) {
        this.metrics[clientId][existingIndex] = metric;
    } else {
        this.metrics[clientId].push(metric);
        // Sort by month
        this.metrics[clientId].sort((a, b) => a.month.localeCompare(b.month));
    }
    return this.metrics[clientId];
  }

  // --- Tasks ---
  getTasks(clientId: string) {
    return this.tasks.filter(t => t.clientId === clientId);
  }

  addTask(task: Task) {
    this.tasks = [task, ...this.tasks];
    return task;
  }

  updateTask(task: Task) {
    this.tasks = this.tasks.map(t => t.id === task.id ? task : t);
  }

  deleteTask(id: string) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    console.log(`Task ${id} deleted. Remaining: ${this.tasks.length}`);
  }

  // --- Reports ---
  getReports(clientId: string) {
    return this.reports.filter(r => r.clientId === clientId);
  }

  addReport(report: Report) {
    this.reports = [report, ...this.reports];
    return report;
  }

  deleteReport(id: string) {
    this.reports = this.reports.filter(r => r.id !== id);
  }

  // --- Settings ---
  getSettings(clientId: string): ClinicSettings {
    if (!this.settings[clientId]) {
       return {
         clientId, name: '', representative: '', phone: '-', address: '', 
         hours: '', lunch: '', blogUrl: '', placeUrl: '', naverId: '', naverPw: '', philosophy: ''
       };
    }
    return this.settings[clientId];
  }

  updateSettings(clientId: string, newSettings: ClinicSettings) {
    this.settings[clientId] = newSettings;
    console.log(`[API] Settings updated for ${clientId}`);
  }

  // --- Integration Helpers ---
  async sendNotification(type: 'kakao' | 'email', to: string, message: string) {
    console.log(`[Integration] Sending ${type} to ${to}: ${message}`);
    return true;
  }
}

export const db = new DataService();