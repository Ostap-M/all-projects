const h = React.createElement;

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
}

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };
  const shapes = {
    plus: [h("path", { d: "M12 5v14M5 12h14", key: "p" })],
    pause: [h("path", { d: "M9 5v14M15 5v14", key: "p" })],
    play: [h("path", { d: "m8 5 11 7-11 7V5Z", key: "p" })],
    reset: [h("path", { d: "M3 12a9 9 0 1 0 2.6-6.4L3 8m0-5v5h5" , key: "p" })],
    trash: [h("path", { d: "M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3", key: "p" })],
    clock: [h("circle", { cx: 12, cy: 12, r: 9, key: "c" }), h("path", { d: "M12 7v5l3 2", key: "p" })],
    check: [h("path", { d: "m5 12 4 4L19 6", key: "p" })],
  };
  return h("svg", common, ...(shapes[name] || []));
}

function AppHeader({ timerCount }) {
  return h("header", { className: "topbar" },
    h("a", { className: "wordmark", href: "#top", "aria-label": "Focus Time — на початок" },
      h("span", { className: "wordmark-icon" }, h(Icon, { name: "clock", size: 21 })),
      h("span", null, "focus", h("b", null, "time"))
    ),
    h("div", { className: "topbar-note" },
      h("span", { className: "online-dot" }),
      timerCount === 0 ? "Твій простір для фокусу" : `${timerCount} ${timerCount === 1 ? "таймер" : "таймери"}`
    )
  );
}

function CreateTimerForm({ onCreate }) {
  const [title, setTitle] = React.useState("");
  const [seconds, setSeconds] = React.useState("");
  const [error, setError] = React.useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const parsedSeconds = Number(seconds);
    if (!title.trim()) {
      setError("Вкажи назву таймера.");
      return;
    }
    if (!Number.isSafeInteger(parsedSeconds) || parsedSeconds < 1) {
      setError("Введи цілу кількість секунд, більшу за нуль.");
      return;
    }
    onCreate(title.trim(), parsedSeconds);
    setTitle("");
    setSeconds("");
    setError("");
  }

  return h("form", { className: "create-panel", onSubmit: handleSubmit, noValidate: true },
    h("div", { className: "form-heading" },
      h("div", { className: "form-icon" }, h(Icon, { name: "plus", size: 22 })),
      h("div", null,
        h("h2", null, "Новий таймер"),
        h("p", null, "Задай назву й тривалість у секундах")
      )
    ),
    h("div", { className: "form-fields" },
      h("label", { className: "field" },
        h("span", null, "Назва таймера"),
        h("input", {
          type: "text",
          value: title,
          onChange: (event) => setTitle(event.target.value),
          placeholder: "Наприклад, Читання",
          maxLength: 48,
          autoComplete: "off",
        })
      ),
      h("label", { className: "field field--seconds" },
        h("span", null, "Тривалість"),
        h("div", { className: "seconds-input" },
          h("input", {
            type: "number",
            min: "1",
            step: "1",
            inputMode: "numeric",
            value: seconds,
            onChange: (event) => setSeconds(event.target.value),
            placeholder: "Секунди",
          }),
          h("span", null, "сек")
        )
      ),
      h("button", { className: "add-button", type: "submit" }, h(Icon, { name: "plus", size: 18 }), "Додати таймер")
    ),
    error ? h("p", { className: "form-error", role: "alert" }, error) : null
  );
}

function TimerCard({ timer, onToggle, onReset, onDelete }) {
  const progress = timer.durationSeconds === 0
    ? 100
    : Math.min(100, Math.max(0, ((timer.durationSeconds - timer.remainingSeconds) / timer.durationSeconds) * 100));
  const statusLabel = timer.finished ? "Завершено" : timer.running ? "Відлік триває" : "На паузі";

  return h("article", { className: `timer-card${timer.finished ? " timer-card--finished" : ""}` },
    h("div", { className: "timer-card-top" },
      h("div", { className: "timer-heading" },
        h("span", { className: `status-dot${timer.running ? " status-dot--running" : timer.finished ? " status-dot--done" : ""}` }),
        h("h3", { title: timer.title }, timer.title)
      ),
      h("button", { className: "icon-button delete-button", type: "button", onClick: () => onDelete(timer.id), "aria-label": `Видалити таймер «${timer.title}»`, title: "Видалити" }, h(Icon, { name: "trash" }))
    ),
    h("div", { className: "timer-readout", "aria-label": `Залишилося ${formatTime(timer.remainingSeconds)}` }, formatTime(timer.remainingSeconds)),
    h("div", { className: "timer-meta" },
      h("span", null, `Початковий час · ${formatTime(timer.durationSeconds)}`),
      h("span", { className: `timer-status${timer.finished ? " timer-status--done" : ""}` }, timer.finished ? h(Icon, { name: "check", size: 14 }) : null, statusLabel)
    ),
    h("div", { className: "progress-track", role: "progressbar", "aria-label": `Прогрес таймера ${timer.title}`, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(progress) },
      h("div", { className: "progress-fill", style: { width: `${progress}%` } })
    ),
    h("div", { className: "timer-actions" },
      h("button", { className: `action-button action-button--primary${timer.running ? " is-pausing" : ""}`, type: "button", onClick: () => onToggle(timer.id), disabled: timer.finished },
        h(Icon, { name: timer.running ? "pause" : "play", size: 16 }),
        timer.running ? "Пауза" : timer.finished ? "Завершено" : "Продовжити"
      ),
      h("button", { className: "action-button action-button--quiet", type: "button", onClick: () => onReset(timer.id), title: "Скинути до початкового часу" },
        h(Icon, { name: "reset", size: 16 }), "Скинути"
      )
    )
  );
}

function TimerList({ timers, onToggle, onReset, onDelete }) {
  if (timers.length === 0) {
    return h("div", { className: "empty-state" },
      h("div", { className: "empty-icon" }, h(Icon, { name: "clock", size: 28 })),
      h("h2", null, "Тут поки тихо"),
      h("p", null, "Створи перший таймер — він з’явиться тут.")
    );
  }
  return h("section", { className: "timer-grid", "aria-label": "Твої таймери" },
    timers.map((timer) => h(TimerCard, { timer, onToggle, onReset, onDelete, key: timer.id }))
  );
}

function App() {
  const [timers, setTimers] = React.useState([]);
  const nextId = React.useRef(1);

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      const now = Date.now();
      setTimers((currentTimers) => {
        let changed = false;
        const updatedTimers = currentTimers.map((timer) => {
          if (!timer.running) return timer;
          const remainingSeconds = Math.max(0, Math.ceil((timer.endAt - now) / 1000));
          if (remainingSeconds === timer.remainingSeconds && remainingSeconds > 0) return timer;
          changed = true;
          const finished = remainingSeconds === 0;
          return { ...timer, remainingSeconds, running: !finished, finished, endAt: finished ? null : timer.endAt };
        });
        return changed ? updatedTimers : currentTimers;
      });
    }, 200);
    return () => window.clearInterval(intervalId);
  }, []);

  function addTimer(title, durationSeconds) {
    const id = nextId.current++;
    setTimers((current) => [{
      id,
      title,
      durationSeconds,
      remainingSeconds: durationSeconds,
      running: true,
      finished: false,
      endAt: Date.now() + durationSeconds * 1000,
    }, ...current]);
  }

  function toggleTimer(id) {
    const now = Date.now();
    setTimers((current) => current.map((timer) => {
      if (timer.id !== id || timer.finished) return timer;
      if (timer.running) {
        const remainingSeconds = Math.max(0, Math.ceil((timer.endAt - now) / 1000));
        const finished = remainingSeconds === 0;
        return { ...timer, remainingSeconds, running: false, finished, endAt: null };
      }
      return { ...timer, running: true, endAt: now + timer.remainingSeconds * 1000 };
    }));
  }

  function resetTimer(id) {
    setTimers((current) => current.map((timer) => timer.id === id
      ? { ...timer, remainingSeconds: timer.durationSeconds, running: false, finished: false, endAt: null }
      : timer
    ));
  }

  function deleteTimer(id) {
    setTimers((current) => current.filter((timer) => timer.id !== id));
  }

  const runningCount = timers.filter((timer) => timer.running).length;
  return h(React.Fragment, null,
    h(AppHeader, { timerCount: timers.length }),
    h("main", { className: "app-shell", id: "top" },
      h("section", { className: "intro" },
        h("p", { className: "eyebrow" }, "ТВІЙ ЧАС · ТВОЇ ПРАВИЛА"),
        h("h1", null, "Зосередься на", h("br"), h("span", null, "важливому.")),
        h("p", { className: "intro-copy" }, "Запускай кілька таймерів одночасно й рухайся у власному ритмі."),
        h("div", { className: "summary-chip" }, h("span", { className: "online-dot" }), `${runningCount} активних ${runningCount === 1 ? "таймер" : "таймерів"}`)
      ),
      h(CreateTimerForm, { onCreate: addTimer }),
      h("div", { className: "list-heading" },
        h("div", null, h("h2", null, "Твої таймери"), h("p", null, timers.length ? "Керуй відліком або додавай нові" : "Створені таймери з’являться в цьому списку")),
        timers.length ? h("span", { className: "timer-total" }, String(timers.length).padStart(2, "0")) : null
      ),
      h(TimerList, { timers, onToggle: toggleTimer, onReset: resetTimer, onDelete: deleteTimer })
    ),
    h("footer", { className: "page-footer" }, "Зроби паузу. Повернись до свого ритму.")
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(h(App));
