"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { hrService } from '@/services/hr.service';
import { PayrollRecord } from '@/types/hr';
import toast from 'react-hot-toast';
import { Printer, Play } from 'lucide-react';

export function PayrollTab() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const [month, setMonth] = useState(currentMonth.toString());
  const [year, setYear] = useState(currentYear.toString());
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [month, year]);

  async function fetchRecords() {
    try {
      setLoading(true);
      const data = await hrService.getPayrollRecords(parseInt(month), parseInt(year));
      setRecords(data);
    } catch (error) {
      toast.error('Failed to load payroll records');
    } finally {
      setLoading(false);
    }
  }

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      await hrService.generatePayroll(parseInt(month), parseInt(year));
      toast.success('Payroll generated successfully');
      fetchRecords();
    } catch (error) {
      toast.error('Failed to generate payroll');
    } finally {
      setGenerating(false);
    }
  };

  const handlePay = async (id: string) => {
    try {
      await hrService.paySalary(id, 'BANK_TRANSFER');
      toast.success('Salary marked as paid');
      fetchRecords();
    } catch (error) {
      toast.error('Failed to process payment');
    }
  };

  const handlePrintSlip = async (record: PayrollRecord) => {
    try {
      toast.loading(`Generating Salary Slip for ${record.user?.name}...`, { id: 'slip-gen' });
      await hrService.downloadSalarySlip(record.id);
      toast.success('Salary slip downloaded successfully', { id: 'slip-gen' });
    } catch (error) {
      toast.error('Failed to generate salary slip', { id: 'slip-gen' });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Select 
              value={month} 
              onChange={(e) => setMonth(e.target.value)} 
              options={Array.from({length: 12}, (_, i) => ({ value: `${i+1}`, label: new Date(2000, i, 1).toLocaleString('default', { month: 'long' }) }))}
              className="w-32"
            />
            <Select 
              value={year} 
              onChange={(e) => setYear(e.target.value)} 
              options={[currentYear-1, currentYear, currentYear+1].map(y => ({ value: `${y}`, label: `${y}` }))}
              className="w-24"
            />
          </div>
          <Button onClick={handleGenerate} disabled={generating || loading} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Play size={16} /> {generating ? 'Generating...' : 'Run Payroll Engine'}
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6 text-sm text-blue-800">
          <strong>Note:</strong> Running the Payroll Engine will automatically calculate deductions for any unpaid absent days during the selected month.
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-4 py-3">Staff Member</th>
                <th className="px-4 py-3 text-right">Base Salary</th>
                <th className="px-4 py-3 text-right text-green-600">Allowances</th>
                <th className="px-4 py-3 text-right text-red-600">Deductions</th>
                <th className="px-4 py-3 text-right font-bold">Net Pay</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8">No records found. Run the engine to generate payroll.</td></tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-medium">{record.user?.name}</div>
                      <div className="text-xs text-muted-foreground">{record.user?.role}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">${record.baseSalary.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-mono text-green-600">+${record.allowances.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-mono text-red-600">-${record.deductions.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-lg">${record.netPay.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${record.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {record.status === 'PENDING' && (
                          <Button size="sm" onClick={() => handlePay(record.id)} className="bg-emerald-600 hover:bg-emerald-700 h-8">
                            Mark Paid
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handlePrintSlip(record)} className="h-8 gap-1">
                          <Printer size={14} /> Slip
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
