import { useEffect, useState } from "react";

export default function App() {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("не начато");

    useEffect(() => {
        const eventSource = new EventSource("http://127.0.0.1:8000/stream/"); // надо вынести в .env, но мне лень

        eventSource.addEventListener("progress", (event) => {
            const data = event.data as number;
            setStatus("Выполняется...");
            setProgress(data);
        });

        eventSource.addEventListener("complete", (event) => {
            console.log("COMPLETE");
            setStatus(event.data);
            eventSource.close();
        });

        eventSource.onerror = () => {
            setStatus("Ошибка соединения");
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <section>
            <div>Статус: {status}</div>
            <div>Прогресс: {progress}</div>
        </section>
    );
}
