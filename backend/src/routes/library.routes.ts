import { Router } from 'express';
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getMembers,
  createMember,
  deleteMember,
  getBookIssues,
  issueBook,
  returnBook
} from '../controllers/library.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';

const router = Router();

// Require authentication for all library routes
router.use(authMiddleware);

// Books
router.route('/books')
  .get(getBooks)
  .post(authorize('ADMIN', 'PRINCIPAL', 'LIBRARIAN'), createBook);

router.route('/books/:id')
  .put(authorize('ADMIN', 'PRINCIPAL', 'LIBRARIAN'), updateBook)
  .delete(authorize('ADMIN', 'PRINCIPAL', 'LIBRARIAN'), deleteBook);

// Members
router.route('/members')
  .get(getMembers)
  .post(authorize('ADMIN', 'PRINCIPAL', 'LIBRARIAN'), createMember);

router.route('/members/:id')
  .delete(authorize('ADMIN', 'PRINCIPAL', 'LIBRARIAN'), deleteMember);

// Issues
router.route('/issues')
  .get(getBookIssues)
  .post(authorize('ADMIN', 'PRINCIPAL', 'LIBRARIAN'), issueBook);

router.route('/issues/:id/return')
  .post(authorize('ADMIN', 'PRINCIPAL', 'LIBRARIAN'), returnBook);

export default router;
