import React, { useState } from "react";
import axios from "axios";
import "./ChatMain.css";

// Define message types

interface chatHistory {
    model: string;
    user: string;
    messages: message[];
}

interface message {
    role: string;
    content: string;
    images: string[];
}
const models = ["GPT-3.5", "GPT-4", "Custom-Bot"]; 
const ChatMain: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const base_url = 'http://localhost:5000/api';
    const [isButtonEnabled, setIsButtonEnabled] = useState(true);
    const [selectedModel, setSelectedModel] = useState<string>(models[0]);

    const [history, setHistory] = useState<chatHistory>({
        model: "llama3.2:latest",
        user: 'user1',
        messages: []
    });

    const create_msg = (role: string, msg_str: string) => {
        let msg = {} as message;
        msg.role = role;
        msg.content = msg_str;
        return msg;
    };
    const create_img_msg = (role: string, image_data: string) => {
        let msg = {} as message;
        msg.role = role;
        msg.images = [image_data];
        return msg;
    };
    

    const handleChatResponse = (response: any) => {
        let responseMessage = '';
        console.log(response);
        let txt_msg = response.data;
        let list: string[] = txt_msg.split("\n");
        list.forEach((element) => {
            if (element === '') return;
            console.log(element)
            let msg = JSON.parse(element);
            if (msg.message !== undefined && msg.message.content !== undefined) {
                responseMessage += msg.message.content; // concatenate strings
            }
            if (msg.done) {
                let assistant_msg = create_msg('assistant', responseMessage)
                setIsButtonEnabled(true);
                setInputValue('');
                setHistory(prev => ({ ...prev, messages: [...prev.messages, assistant_msg] }))

            }
        });
    };

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            handleSendMessage(event);
        }
    }

    const handleSendMessage = async (e: any) => {
        e.preventDefault();
        let msg = create_msg('user', inputValue);
        history.messages.push(msg);
        setIsButtonEnabled(false);
        try {
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${base_url}/chat`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(history) // Send the entire chat history as JSON
            };
            let response = await axios.request(config);
            handleChatResponse(response);
        } catch (error) {
            console.error(error);
        }
    };
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };


    const toBase64 = (file: File) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

    const handleFileUpload = async (e: any) => {
        console.log(e.target.files);
        debugger
        URL.createObjectURL(e.target.files[0])
        try {
            const result = await toBase64(e.target.files[0]);
            console.log(result);
            let msg = create_img_msg('user', result as string);
            setHistory(prev => ({ ...prev, messages: [...prev.messages, msg] }))
        } catch (error) {
            console.error(error);
            return;
        }
        // setFile(URL.createObjectURL(e.target.files[0]));
    }
    const renderMessage = (message: string, index: number) => {
        const isCodeBlock = /```[\s\S]*?```/.test(message);
        return (
          <div
            key={index}
          
          >
            {isCodeBlock ? (
              <pre >
                <code>{message.replace(/```/g, "")}</code>
                <button
                  
                  onClick={() => copyToClipboard(message.replace(/```/g, ""))}
                >
                  Copy
                </button>
              </pre>
            ) : (
              <p>{message}</p>
            )}
          </div>
        );
      };

    return (
        <div className="chat-container">
            <div className="model-selector">
                <label htmlFor="model-select">Model:</label>
                <select
                    id="model-select"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                >
                    {models.map((model, index) => (
                        <option key={index} value={model}>
                            {model}
                        </option>
                    ))}
                </select>
            </div>
            <div className="chat-box">
                {history.messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        {msg.images && msg.images.length > 0 ? (
                            <img
                                src={msg.images[0]}
                                alt="uploaded"
                                className="uploaded-image"
                            />
                        ) : (
                            renderMessage( msg.content,index)
                        )}
                    </div>
                ))}
            </div>

            <div className="input-box">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                {/* Upload button */}
                <input type="file" id="file-upload" onChange={handleFileUpload} hidden />
                <label htmlFor="file-upload" className="upload-button" title="Upload a file">
                    📎
                </label>

                <button onClick={handleSendMessage}
                    disabled={!isButtonEnabled}>  {isButtonEnabled ? "Send" : "Loading..."}</button>
            </div>
        </div>
    );
};

export default ChatMain;
