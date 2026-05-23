"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const library_controller_1 = require("../controllers/library.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Require authentication for all library routes
router.use(auth_middleware_1.authMiddleware);
// Books
router.route('/books')
    .get(library_controller_1.getBooks)
    .post((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'LIBRARIAN'), library_controller_1.createBook);
router.route('/books/:id')
    .put((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'LIBRARIAN'), library_controller_1.updateBook)
    .delete((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'LIBRARIAN'), library_controller_1.deleteBook);
// Members
router.route('/members')
    .get(library_controller_1.getMembers)
    .post((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'LIBRARIAN'), library_controller_1.createMember);
router.route('/members/:id')
    .delete((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'LIBRARIAN'), library_controller_1.deleteMember);
// Issues
router.route('/issues')
    .get(library_controller_1.getBookIssues)
    .post((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'LIBRARIAN'), library_controller_1.issueBook);
router.route('/issues/:id/return')
    .post((0, auth_middleware_1.authorize)('ADMIN', 'PRINCIPAL', 'LIBRARIAN'), library_controller_1.returnBook);
exports.default = router;
