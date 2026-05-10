import { DocumentCard, type DocumentCardModel } from "@/components/document/DocumentCard";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

type Props = {
  documents: DocumentCardModel[];
  className?: string;
};

export function DocumentGrid({ documents, className }: Props) {
  if (documents.length === 0) {
    return (
      <Paper
        variant="outlined"
        className={className}
        sx={{
          py: 10,
          px: 2,
          textAlign: "center",
          borderStyle: "dashed",
          bgcolor: "action.hover",
        }}
      >
        <Typography color="text.secondary">Chưa có tài liệu nào.</Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3} className={className}>
      {documents.map((doc) => (
        <Grid key={doc.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
          <DocumentCard doc={doc} />
        </Grid>
      ))}
    </Grid>
  );
}
