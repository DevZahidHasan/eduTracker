'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Book, Users, ClipboardList, Trash2, CheckCircle, FileUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { Modal } from '@/components/ui/Modal';
import { CSVImporter } from '@/components/ui/CSVImporter';
import { Select } from '@/components/ui/Select';

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'books' | 'members' | 'issues'>('books');
  const [books, setBooks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Dropdown States
  const [classesList, setClassesList] = useState<any[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  // Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Forms State
  const [newBook, setNewBook] = useState({ title: '', author: '', category: '', totalCopies: 1 });
  const [newMember, setNewMember] = useState({ studentId: '' });
  const [newIssue, setNewIssue] = useState({ bookId: '', memberId: '', issueDate: new Date().toISOString().split('T')[0], dueDate: '' });

  useEffect(() => {
    fetchData();
    if (classesList.length === 0) {
      api.get('/classes/overview').then(res => setClassesList(res.data.data || res.data || []));
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedClass) {
      api.get(`/students?className=${selectedClass}`).then(res => {
        setStudentsList(res.data.data || []);
      }).catch(console.error);
    } else {
      setStudentsList([]);
    }
  }, [selectedClass]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'books') {
        const res = await api.get('/library/books');
        setBooks(res.data.data);
      } else if (activeTab === 'members') {
        const res = await api.get('/library/members');
        setMembers(res.data.data);
      } else if (activeTab === 'issues') {
        const [issuesRes, booksRes, membersRes] = await Promise.all([
          api.get('/library/issues'),
          books.length === 0 ? api.get('/library/books') : Promise.resolve({ data: { data: books } }),
          members.length === 0 ? api.get('/library/members') : Promise.resolve({ data: { data: members } })
        ]);
        setIssues(issuesRes.data.data);
        if (books.length === 0) setBooks(booksRes.data.data);
        if (members.length === 0) setMembers(membersRes.data.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // --- Books ---
  const handleAddBook = async () => {
    try {
      await api.post('/library/books', newBook);
      toast.success('Book added successfully');
      setNewBook({ title: '', author: '', category: '', totalCopies: 1 });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add book');
    }
  };

  const confirmDeleteBook = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Book',
      message: 'Are you sure you want to delete this book? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await api.delete(`/library/books/${id}`);
          toast.success('Book deleted successfully');
          fetchData();
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Failed to delete book');
        }
      }
    });
  };

  // --- Members ---
  const handleAddMember = async () => {
    try {
      await api.post('/library/members', newMember);
      toast.success('Member added successfully');
      setNewMember({ studentId: '' });
      setSelectedClass('');
      setSelectedSection('');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const confirmDeleteMember = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Member',
      message: 'Are you sure you want to remove this library member?',
      onConfirm: async () => {
        try {
          await api.delete(`/library/members/${id}`);
          toast.success('Member removed successfully');
          fetchData();
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Failed to remove member');
        }
      }
    });
  };

  // --- Issues ---
  const handleIssueBook = async () => {
    try {
      await api.post('/library/issues', newIssue);
      toast.success('Book issued successfully');
      setNewIssue({ bookId: '', memberId: '', issueDate: new Date().toISOString().split('T')[0], dueDate: '' });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to issue book');
    }
  };

  const confirmReturnBook = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Return Book',
      message: 'Are you sure you want to mark this book as returned?',
      onConfirm: async () => {
        try {
          await api.post(`/library/issues/${id}/return`, { fineAmount: 0 });
          toast.success('Book returned successfully');
          fetchData();
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Failed to return book');
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Library Management</h1>
        <p className="text-muted-foreground">Manage books, library members, and book issues.</p>
      </div>

      <div className="flex gap-4 border-b pb-2">
        <Button 
          variant={activeTab === 'books' ? 'primary' : 'ghost'} 
          onClick={() => setActiveTab('books')}
        >
          <Book className="w-4 h-4 mr-2" /> Books
        </Button>
        <Button 
          variant={activeTab === 'members' ? 'primary' : 'ghost'} 
          onClick={() => setActiveTab('members')}
        >
          <Users className="w-4 h-4 mr-2" /> Members
        </Button>
        <Button 
          variant={activeTab === 'issues' ? 'primary' : 'ghost'} 
          onClick={() => setActiveTab('issues')}
        >
          <ClipboardList className="w-4 h-4 mr-2" /> Issues
        </Button>
      </div>

      {activeTab === 'books' && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Inventory Management</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setIsImportModalOpen(true)}>
                <FileUp size={16} className="mr-2" /> Import Books (CSV)
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-wrap items-end border-t pt-6">
                <div className="flex-1 min-w-[200px]">
                  <Input 
                    label="Book Title"
                    placeholder="Enter title" 
                    value={newBook.title} 
                    onChange={e => setNewBook({...newBook, title: e.target.value})} 
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <Input 
                    label="Author"
                    placeholder="Enter author" 
                    value={newBook.author} 
                    onChange={e => setNewBook({...newBook, author: e.target.value})} 
                  />
                </div>
                <div className="w-48">
                  <Input 
                    label="Category"
                    placeholder="e.g. Science" 
                    value={newBook.category} 
                    onChange={e => setNewBook({...newBook, category: e.target.value})} 
                  />
                </div>
                <div className="w-24">
                  <Input 
                    label="Copies"
                    type="number"
                    value={newBook.totalCopies} 
                    onChange={e => setNewBook({...newBook, totalCopies: parseInt(e.target.value) || 1})} 
                  />
                </div>
                <Button onClick={handleAddBook} disabled={!newBook.title || !newBook.author || !newBook.category} className="mb-0.5">
                  Add Book
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Books Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : books.length > 0 ? (
                <div className="divide-y">
                  {books.map(book => (
                    <div key={book.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{book.title} <span className="text-xs text-muted-foreground ml-2">(ID: {book.id})</span></p>
                        <p className="text-sm text-muted-foreground">{book.author} • {book.category}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">Available: {book.availableCopies} / {book.totalCopies}</span>
                        <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" size="sm" onClick={() => confirmDeleteBook(book.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No books found in the library.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Member</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4 flex-wrap items-end">
              <div className="w-48">
                <Select
                  options={classesList.map(c => ({ value: c.className, label: c.className.replace('_', ' ') }))}
                  value={selectedClass}
                  onChange={e => { setSelectedClass(e.target.value); setSelectedSection(''); setNewMember({ studentId: '' }); }}
                  placeholder="Select Class"
                />
              </div>
              <div className="w-48">
                <Select
                  options={(classesList.find(c => c.className === selectedClass)?.sections || []).map((s: any) => ({ value: s.section, label: s.section }))}
                  value={selectedSection}
                  onChange={e => { setSelectedSection(e.target.value); setNewMember({ studentId: '' }); }}
                  placeholder="Select Section"
                  disabled={!selectedClass}
                />
              </div>
              <div className="w-64">
                <Select
                  options={studentsList.filter(s => !selectedSection || s.section === selectedSection).map(s => ({ value: s.id, label: `${s.fullName} (${s.rollNumber})` }))}
                  value={newMember.studentId}
                  onChange={e => setNewMember({ studentId: e.target.value })}
                  placeholder="Select Student"
                  disabled={!selectedClass}
                />
              </div>
              <Button onClick={handleAddMember} disabled={!newMember.studentId}>
                Add Member
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Library Members</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : members.length > 0 ? (
                <div className="divide-y">
                  {members.map(member => (
                    <div key={member.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{member.memberId}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.student ? `${member.student.fullName} (${member.student.className} - ${member.student.section})` : 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${member.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {member.status}
                        </span>
                        <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" size="sm" onClick={() => confirmDeleteMember(member.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No members found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'issues' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Issue a Book</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4 flex-wrap items-end">
              <div className="w-64 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground/80">Book ID or Title</label>
                <Input 
                  list="books-list"
                  placeholder="Type to search books..." 
                  value={newIssue.bookId} 
                  onChange={e => setNewIssue({...newIssue, bookId: e.target.value})}
                />
                <datalist id="books-list">
                  {books.filter(b => b.availableCopies > 0).map(b => (
                    <option key={b.id} value={b.id}>
                      {b.title} (Avail: {b.availableCopies})
                    </option>
                  ))}
                </datalist>
              </div>
              <div className="w-64 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground/80">Member ID</label>
                <Input 
                  list="members-list"
                  placeholder="Type to search members..." 
                  value={newIssue.memberId} 
                  onChange={e => setNewIssue({...newIssue, memberId: e.target.value})}
                />
                <datalist id="members-list">
                  {members.filter(m => m.status === 'ACTIVE').map(m => (
                    <option key={m.id} value={m.memberId}>
                      {m.student?.fullName || m.user?.name || 'Unknown'}
                    </option>
                  ))}
                </datalist>
              </div>
              <div className="w-40 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground/80">Issue Date</label>
                <Input 
                  type="date"
                  value={newIssue.issueDate} 
                  onChange={e => setNewIssue({...newIssue, issueDate: e.target.value})} 
                />
              </div>
              <div className="w-40 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground/80">Due Date</label>
                <Input 
                  type="date"
                  value={newIssue.dueDate} 
                  onChange={e => setNewIssue({...newIssue, dueDate: e.target.value})} 
                />
              </div>
              <Button onClick={handleIssueBook} disabled={!newIssue.bookId || !newIssue.memberId || !newIssue.dueDate || !newIssue.issueDate}>
                Issue Book
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Issued Books</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : issues.length > 0 ? (
                <div className="divide-y">
                  {issues.map(issue => (
                    <div key={issue.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{issue.book?.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Issued to: <span className="font-medium">{issue.member?.student?.fullName || issue.member?.user?.name || 'Unknown'}</span>
                          <br/>
                          <span className="inline-block mt-1">
                            Issued: {new Date(issue.issueDate).toLocaleDateString()} • Due: {new Date(issue.dueDate).toLocaleDateString()}
                            {issue.returnDate && ` • Returned: ${new Date(issue.returnDate).toLocaleDateString()}`}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          issue.status === 'RETURNED' ? 'bg-green-100 text-green-700' :
                          new Date(issue.dueDate) < new Date() ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {issue.status}
                        </span>
                        {issue.status !== 'RETURNED' && (
                          <Button variant="outline" size="sm" onClick={() => confirmReturnBook(issue.id)} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" /> Return
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No book issues found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        destructive={confirmModal.title.includes('Delete')}
        confirmText={confirmModal.title.includes('Delete') ? 'Delete' : 'Confirm'}
      />

      {/* Import CSV Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Bulk Import Books"
        className="max-w-xl"
      >
        <CSVImporter 
          type="books" 
          onSuccess={() => {
            fetchData();
          }}
          onClose={() => setIsImportModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
