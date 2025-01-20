import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid2 as Grid,
  Card,
  CardContent,
  CardActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [repositories, setRepositories] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 6; // Quantidade de repositórios por página

  // Função para buscar repositórios do GitHub
  const fetchRepositories = async () => {
    setLoading(true);
    setError("");
    setRepositories([]);
    setFilteredRepos([]);
    setLanguages([]);
    setPage(1);

    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100`
      );
      if (!response.ok) {
        throw new Error("Usuário não encontrado ou erro na requisição.");
      }
      const data = await response.json();

      // Obtendo as linguagens disponíveis
      const uniqueLanguages = [...new Set(data.map((repo) => repo.language))].filter(
        (lang) => lang !== null
      );

      setRepositories(data);
      setFilteredRepos(data);
      setLanguages(uniqueLanguages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar repositórios por linguagem
  const filterByLanguage = (language) => {
    setSelectedLanguage(language);
    setPage(1);
    if (!language) {
      setFilteredRepos(repositories);
    } else {
      const filtered = repositories.filter((repo) => repo.language === language);
      setFilteredRepos(filtered);
    }
  };

  // Repositórios exibidos na página atual
  const paginatedRepos = filteredRepos.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard de Repositórios GitHub
      </Typography>

      {/* Campo de Entrada e Botão */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          label="Nome de Usuário do GitHub"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={fetchRepositories}
          disabled={!username || loading}
        >
          {loading ? "Carregando..." : "Buscar"}
        </Button>
      </Box>

      {/* Mensagem de Erro */}
      {error && (
        <Typography color="error" sx={{ mb: 4 }}>
          {error}
        </Typography>
      )}

      {/* Filtro de Linguagem */}
      {languages.length > 0 && (
        <FormControl sx={{ mb: 4, width: 300 }}>
          <InputLabel>Linguagem</InputLabel>
          <Select
            value={selectedLanguage}
            onChange={(e) => filterByLanguage(e.target.value)}
            label="Linguagem"
          >
            <MenuItem value="">Todas</MenuItem>
            {languages.map((language) => (
              <MenuItem key={language} value={language}>
                {language}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Lista de Repositórios */}
      <Grid container spacing={3}>
        {paginatedRepos.map((repo) => (
          <Grid item xs={12} sm={6} md={4} key={repo.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {repo.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {repo.description || "Sem descrição"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  🌟 Estrelas: {repo.stargazers_count} | 🍴 Forks: {repo.forks_count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  🛠️ Linguagem: {repo.language || "Não especificada"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver no GitHub
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Paginação */}
      {filteredRepos.length > ITEMS_PER_PAGE && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <Typography variant="body1" sx={{ alignSelf: "center" }}>
            Página {page} de {Math.ceil(filteredRepos.length / ITEMS_PER_PAGE)}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setPage(page + 1)}
            disabled={page === Math.ceil(filteredRepos.length / ITEMS_PER_PAGE)}
          >
            Próxima
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
