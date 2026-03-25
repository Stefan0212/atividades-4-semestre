import { useBooks } from '../context/BooksContext';
import { MenuItem, Select, Typography, Box } from '@mui/material';
import { useState } from 'react';
import { Card, CardContent } from '@mui/material';

export default function CourseFilter() {
  const { books } = useBooks();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<number | ''>('');

  const courses = [...new Set(books.map((book) => book.course))];
  const semesters = [...new Set(books.map((book) => book.semester))].sort((a, b) => a - b);

  const filteredBooks = books.filter((b) => {
    const matchCourse = selectedCourse === '' || b.course === selectedCourse;
    const matchSemester = selectedSemester === '' || b.semester === selectedSemester;
    return matchCourse && matchSemester;
  });

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Filtrar por Disciplina e Semestre
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>Disciplina</Typography>
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            displayEmpty
            sx={{ minWidth: 280 }}
          >
            <MenuItem value="">Todas</MenuItem>
            {courses.map((course) => (
              <MenuItem key={course} value={course}>
                {course}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>Semestre</Typography>
          <Select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value as number | '')}
            displayEmpty
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">Todos</MenuItem>
            {semesters.map((sem) => (
              <MenuItem key={sem} value={sem}>
                {sem}º Semestre
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {filteredBooks.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Nenhum livro encontrado para os filtros selecionados.
        </Typography>
      ) : (
        filteredBooks.map((book, idx) => (
          <Card key={idx} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6">{book.title}</Typography>
              <Typography variant="body2">
                {book.author} - {book.publisher} ({book.year})
              </Typography>
              <Typography variant="caption" color="primary">
                Disciplina: {book.course} | {book.semester}º Semestre
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </>
  );
}