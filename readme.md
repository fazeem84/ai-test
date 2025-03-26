# Setup Ollama
1. docker pull ollama/ollama
2. docker run  --network backend -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama 
3. `docker exec -it ollama ollama run llama3.2`
# Run Back end and front End
