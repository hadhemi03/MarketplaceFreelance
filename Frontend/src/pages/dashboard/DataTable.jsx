import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from '@mui/material';
import { NumericFormat } from 'react-number-format';

const StatusIndicator = ({ status }) => {
  if (status === "In Progress") {
    return <span style={{ color: "#FFA500", fontWeight: 'bold' }}>In Progress</span>; // Orange for "In Progress"
  } else if (status === "Completed") {
    return <span style={{ color: "#28a745", fontWeight: 'bold' }}>Completed</span>; // Green for "Completed"
  }
  return <span style={{ color: "gray" }}>{status}</span>; // Default gray for other statuses
};

const DataTable = ({ columns, rows }) => {
  if (!Array.isArray(rows)) {
    return <Typography>No data available</Typography>;
  }

  return (
    <Box sx={{ backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '8px' }}>
      <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
        <Table sx={{ borderCollapse: 'collapse', boxShadow: 2 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#2a4d73', color: 'white', '& th': { fontWeight: 'bold' } }}>
              {columns.map((col) => (
                <TableCell key={col.id} align={col.align || 'left'} sx={{ color: 'white', fontSize: '1rem' }}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white', // Alternating row colors
                    '&:hover': {
                      backgroundColor: '#e0f7fa', // Light cyan on hover
                    },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      align={col.align || 'left'}
                      sx={{
                        fontSize: '0.9rem',
                        padding: '12px',
                        color: '#555',
                        borderBottom: '1px solid #ddd',
                      }}
                    >
                      {col.format ? col.format(row[col.id], row) : row[col.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ padding: '20px' }}>
                  No data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// PropTypes
DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      align: PropTypes.string,
      format: PropTypes.func,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
};

StatusIndicator.propTypes = {
  status: PropTypes.string.isRequired,
};

// Export the components
export { StatusIndicator };
export default DataTable;
