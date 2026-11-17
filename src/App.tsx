import { useEffect, useRef, useState } from "react";

type Screen =
  | "splash"
  | "login"
  | "signup"
  | "forgot"
  | "code"
  | "new-password"
  | "home"
  | "agenda"
  | "routine"
  | "help"
  | "settings"
  | "create-task"
  | "view-task"
  | "edit-task";

type Task = {
  id: number;
  time: string;
  name: string;
  duration: string;
  effort: number;
  completed: boolean;
  energy: [number, number, number];
};

const A = "/assets";
const initialTasks: Task[] = [
  {
    id: 1,
    time: "08:30",
    name: "Tomar café da manhã",
    duration: "20 min",
    effort: 1,
    completed: false,
    energy: [1, 1, 1],
  },
  {
    id: 2,
    time: "09:00",
    name: "Tomar medicação",
    duration: "10 min",
    effort: 1,
    completed: false,
    energy: [1, 1, 1],
  },
  {
    id: 3,
    time: "10:00",
    name: "Planejar o dia",
    duration: "30 min",
    effort: 2,
    completed: false,
    energy: [3, 1, 2],
  },
];

function SpoonIcon({ light = false, size = 24 }: { light?: boolean; size?: number }) {
  return (
    <img
      src={`${A}/${light ? "4e172.svg" : "b3170.svg"}`}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
    />
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      className={`button button--${variant}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
      />
    </label>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="back-button" onClick={onClick} aria-label="Voltar">
      <img src={`${A}/67316.svg`} width="24" height="24" alt="" />
    </button>
  );
}

function AuthPage({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <main className={`auth-page ${className}`}>{children}</main>;
}

function PasswordRequirements() {
  return (
    <ul className="password-rules">
      <li>No mínimo 8 caracteres</li>
      <li>Pelo menos 1 caracter em maiúsculo e especial (#,%,&amp;,@,_,?,!)</li>
      <li>Pelo menos 1 número</li>
    </ul>
  );
}

function Header({
  go,
  menuOpen,
  setMenuOpen,
}: {
  go: (screen: Screen) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}) {
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen, setMenuOpen]);

  return (
    <>
      <header className="main-header">
        <button className="brand" onClick={() => go("home")} aria-label="Ir para o início">
          <span className="brand__icon">
            <SpoonIcon />
          </span>
          <strong>Spoon</strong>
        </button>
        <div className="header-actions">
          <button onClick={() => go("help")} aria-label="Ajuda">
            <img src={`${A}/9239c.svg`} width="44" height="44" alt="" />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            <img
              src={`${A}/${menuOpen ? "eb9d6.svg" : "22e8b.svg"}`}
              width="24"
              height="24"
              alt=""
            />
          </button>
        </div>
      </header>
      {menuOpen && (
        <>
          <button
            className="menu-scrim"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
          />
          <aside className="side-menu" aria-label="Menu" role="dialog" aria-modal="true">
            <div className="profile-summary">
              <span className="profile-avatar">M</span>
              <div>
                <strong>Marina</strong>
                <span>marina@email.com</span>
              </div>
            </div>
            {[
              ["home", "Hoje"],
              ["agenda", "Agenda"],
              ["routine", "Rotinas"],
              ["help", "Ajuda"],
              ["settings", "Ajustes"],
            ].map(([destination, label]) => (
              <button
                key={destination}
                onClick={() => {
                  setMenuOpen(false);
                  go(destination as Screen);
                }}
              >
                <span>{label}</span>
                <img src={`${A}/cb09d.svg`} width="20" height="20" alt="" />
              </button>
            ))}
            <button className="logout" onClick={() => go("login")}>
              Sair da conta
            </button>
          </aside>
        </>
      )}
    </>
  );
}

function BottomNav({ screen, go }: { screen: Screen; go: (screen: Screen) => void }) {
  const items: { screen: Screen; label: string; icon?: string }[] = [
    { screen: "home", label: "Hoje" },
    { screen: "agenda", label: "Agenda", icon: "82990.svg" },
    { screen: "routine", label: "Rotinas", icon: "ae2cb.svg" },
    { screen: "settings", label: "Ajustes", icon: "c617c.svg" },
  ];
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {items.map((item) => {
        const active =
          screen === item.screen ||
          (item.screen === "home" && ["create-task", "view-task", "edit-task"].includes(screen));
        return (
          <button
            key={item.screen}
            className={active ? "active" : ""}
            onClick={() => go(item.screen)}
            aria-current={active ? "page" : undefined}
            aria-label={item.label}
          >
            {item.icon ? (
              <img src={`${A}/${item.icon}`} width="20" height="20" alt="" />
            ) : (
              <span className="home-icon" />
            )}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function PageShell({
  screen,
  go,
  children,
}: {
  screen: Screen;
  go: (screen: Screen) => void;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="app-page">
      <a className="skip-link" href="#main-content">
        Ir para o conteúdo
      </a>
      <Header go={go} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {children}
      <BottomNav screen={screen} go={go} />
    </div>
  );
}

function BudgetCarousel({ completed }: { completed: number }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    {
      tone: "budget",
      eyebrow: "Seu orçamento de hoje",
      title: "Você ainda tem espaço no seu dia",
      text: "As atividades planejadas estão usando 3 de 12 colheres.",
    },
    {
      tone: "pause",
      eyebrow: "Uma pausa também é parte do plano",
      title: "Que tal reservar 10 minutos para respirar?",
      text: "Pausas ajudam a preservar energia entre uma atividade e outra.",
    },
    {
      tone: "progress",
      eyebrow: "Seu ritmo de hoje",
      title: completed ? "Você está avançando no seu tempo" : "Comece pelo que parece mais leve",
      text: completed
        ? `${completed} ${completed === 1 ? "atividade concluída" : "atividades concluídas"} até agora.`
        : "Não precisa fazer tudo de uma vez. Escolha uma tarefa possível.",
    },
  ];
  const change = (direction: number) =>
    setSlide((current) => (current + direction + slides.length) % slides.length);
  const current = slides[slide];

  return (
    <section
      className={`budget-carousel budget-carousel--${current.tone}`}
      role="region"
      aria-label="Resumo do dia"
      aria-roledescription="carrossel"
    >
      <div className="carousel-topline">
        <div className="card-label">
          <span className="brand__icon small">
            <SpoonIcon size={20} />
          </span>
          <strong>{current.eyebrow}</strong>
        </div>
        <span className="slide-count">
          {slide + 1} de {slides.length}
        </span>
      </div>
      <div className="carousel-copy" key={slide} aria-live="polite">
        <h2>{current.title}</h2>
        <p>{current.text}</p>
        {slide === 0 && (
          <>
            <div className="progress">
              <span style={{ width: "25%" }} />
            </div>
            <div className="budget-values">
              <span>3 usadas</span>
              <span>9 disponíveis</span>
            </div>
          </>
        )}
        {slide === 1 && <span className="pause-pill">Pausa sugerida · 15:00</span>}
      </div>
      <div className="carousel-controls">
        <button onClick={() => change(-1)} aria-label="Banner anterior">
          ←
        </button>
        <div className="carousel-dots">
          {slides.map((item, index) => (
            <button
              key={item.title}
              className={index === slide ? "active" : ""}
              onClick={() => setSlide(index)}
              aria-label={`Ir para banner ${index + 1}`}
              aria-current={index === slide}
            />
          ))}
        </div>
        <button onClick={() => change(1)} aria-label="Próximo banner">
          →
        </button>
      </div>
    </section>
  );
}

function TaskRow({
  task,
  onToggle,
  onOpen,
}: {
  task: Task;
  onToggle: () => void;
  onOpen: () => void;
}) {
  return (
    <div className={`task-row ${task.completed ? "is-completed" : ""}`}>
      <button
        className={`checkbox ${task.completed ? "checked" : ""}`}
        onClick={onToggle}
        aria-label={task.completed ? `Reabrir ${task.name}` : `Concluir ${task.name}`}
        aria-pressed={task.completed}
      >
        {task.completed ? "✓" : ""}
      </button>
      <button className="task-main" onClick={onOpen}>
        <time>{task.time}</time>
        <strong>{task.name}</strong>
        <span className="effort">
          {task.effort} <SpoonIcon size={15} />
        </span>
      </button>
    </div>
  );
}

function Home({
  go,
  tasks,
  setTasks,
  openTask,
}: {
  go: (screen: Screen) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  openTask: (id: number) => void;
}) {
  const [showInfo, setShowInfo] = useState(true);
  const pending = tasks.filter((task) => !task.completed);
  const completed = tasks.filter((task) => task.completed);
  const toggleTask = (id: number) =>
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  return (
    <PageShell screen="home" go={go}>
      <main className="page-content home-page" id="main-content">
        <p className="eyebrow">Hoje, 13 de maio de 2026</p>
        <div className="title-row">
          <div>
            <h1>Olá, Marina!</h1>
            <p>Organize seu dia respeitando seus limites.</p>
          </div>
          <button className="create-button" onClick={() => go("create-task")}>
            <span>＋</span> Criar tarefa
          </button>
        </div>

        {showInfo && (
          <section className="info-card">
            <button className="close" onClick={() => setShowInfo(false)} aria-label="Fechar aviso">
              ×
            </button>
            <h2>O que são essas “colheres”?</h2>
            <p>
              Uma representação visual da energia disponível para as tarefas do dia, em uma escala
              de 1 a 5. Não é uma medida médica, e sim um apoio para organizar sua rotina.
            </p>
            <Button variant="outline" onClick={() => go("help")}>
              Não entendeu? Saiba mais
            </Button>
          </section>
        )}

        <BudgetCarousel completed={completed.length} />

        <section className="tasks-card" aria-labelledby="today-tasks-title">
          <div className="tasks-heading">
            <div>
              <h2 id="today-tasks-title">Atividades de hoje</h2>
              <p aria-live="polite">
                {pending.length} atividades · {pending.reduce((sum, task) => sum + task.effort, 0)}{" "}
                colheres
              </p>
            </div>
            <button onClick={() => go("create-task")} aria-label="Criar tarefa">
              ＋
            </button>
          </div>
          {pending.length ? (
            pending.map((task) => (
              <TaskRow
                task={task}
                key={task.id}
                onToggle={() => toggleTask(task.id)}
                onOpen={() => openTask(task.id)}
              />
            ))
          ) : (
            <p className="empty-state">Você concluiu todas as atividades planejadas.</p>
          )}
        </section>

        <section className="tasks-card completed-card" aria-labelledby="completed-tasks-title">
          <div className="tasks-heading">
            <div>
              <h2 id="completed-tasks-title">Concluídas</h2>
              <p aria-live="polite">
                {completed.length} {completed.length === 1 ? "atividade" : "atividades"}
              </p>
            </div>
            <span className="completed-badge">{completed.length}</span>
          </div>
          {completed.length ? (
            completed.map((task) => (
              <TaskRow
                task={task}
                key={task.id}
                onToggle={() => toggleTask(task.id)}
                onOpen={() => openTask(task.id)}
              />
            ))
          ) : (
            <p className="empty-state">As tarefas marcadas aparecerão aqui.</p>
          )}
        </section>
      </main>
    </PageShell>
  );
}

function TaskSheet({
  screen,
  go,
  selectedTask,
  saveTask,
  deleteTask,
}: {
  screen: "create-task" | "view-task" | "edit-task";
  go: (screen: Screen) => void;
  selectedTask?: Task;
  saveTask: (task: Task) => void;
  deleteTask: (id: number) => void;
}) {
  const isView = screen === "view-task";
  const isCreate = screen === "create-task";
  const [name, setName] = useState(selectedTask?.name ?? "");
  const [time, setTime] = useState(selectedTask?.time ?? "12:30");
  const [duration, setDuration] = useState(selectedTask?.duration ?? "20 min");
  const [effort, setEffort] = useState(selectedTask?.effort ?? 3);
  const [energy, setEnergy] = useState<[number, number, number]>(selectedTask?.energy ?? [3, 3, 3]);
  const [details, setDetails] = useState(!isCreate);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const energyInfo = [
    { label: "Cognitiva", className: "cognitive" },
    { label: "Sensorial", className: "sensory" },
    { label: "Social", className: "social" },
  ];

  const submit = () => {
    saveTask({
      id: selectedTask?.id ?? Date.now(),
      name: name.trim() || "Nova tarefa",
      time,
      duration,
      effort,
      energy,
      completed: selectedTask?.completed ?? false,
    });
  };

  return (
    <PageShell screen={screen} go={go}>
      <div className="task-background">
        <div className="scrim" onClick={() => go("home")} />
        <main
          className="task-sheet"
          id="main-content"
          aria-label={isView ? "Detalhes da tarefa" : undefined}
        >
          <div className="sheet-scroll">
            <div className="sheet-heading">
              <div>
                {isView && <span className="sheet-kicker">Detalhes da tarefa</span>}
                <h1>
                  {isView ? selectedTask?.name : isCreate ? "Criar nova tarefa" : "Editar tarefa"}
                </h1>
              </div>
              <button onClick={() => go("home")} aria-label="Fechar">
                ×
              </button>
            </div>

            {isView && selectedTask ? (
              <div className="task-detail">
                <div className="detail-grid">
                  <div>
                    <span>Horário</span>
                    <strong>{selectedTask.time}</strong>
                  </div>
                  <div>
                    <span>Duração</span>
                    <strong>{selectedTask.duration}</strong>
                  </div>
                </div>
                <section className="detail-effort">
                  <span>Esforço estimado</span>
                  <strong>
                    {selectedTask.effort} <SpoonIcon size={18} />
                  </strong>
                </section>
                <section className="energy-summary">
                  <h2>Detalhamento de energia</h2>
                  {energyInfo.map((item, index) => (
                    <div key={item.label}>
                      <span className={`energy-dot ${item.className}`} />
                      <span>{item.label}</span>
                      <strong>{selectedTask.energy[index]}/5</strong>
                    </div>
                  ))}
                </section>
              </div>
            ) : (
              <>
                <Field
                  label="Nome da tarefa:"
                  placeholder="Ex: Tomar café da manhã"
                  value={name}
                  onChange={setName}
                />
                <div className="field-grid">
                  <Field
                    label="Horário:"
                    placeholder="12:30"
                    type="time"
                    value={time}
                    onChange={setTime}
                  />
                  <label className="field">
                    <span>Duração</span>
                    <select value={duration} onChange={(event) => setDuration(event.target.value)}>
                      <option>10 min</option>
                      <option>20 min</option>
                      <option>30 min</option>
                      <option>1 hora</option>
                    </select>
                  </label>
                </div>
                <section className="effort-card">
                  <div>
                    <h2>Quanto esforço parece exigir?</h2>
                    <p>Você pode ajustar isso a qualquer momento.</p>
                  </div>
                  <strong>{effort}</strong>
                  <input
                    aria-label="Nível de esforço"
                    type="range"
                    min="1"
                    max="5"
                    value={effort}
                    onChange={(event) => setEffort(Number(event.target.value))}
                  />
                  <div className="range-labels">
                    <span>1 · Muito baixo</span>
                    <span>3 · Médio</span>
                    <span>5 · Muito alto</span>
                  </div>
                </section>
                <button
                  className="details-toggle"
                  onClick={() => setDetails(!details)}
                  aria-expanded={details}
                >
                  <span>Detalhar energias cognitiva, sensorial e social</span>
                  <span>{details ? "⌃" : "⌄"}</span>
                </button>
                {details && (
                  <section className="energy-details">
                    {energyInfo.map((item, index) => (
                      <label className={item.className} key={item.label}>
                        <span>
                          <i className={`energy-dot ${item.className}`} />
                          {item.label}
                        </span>
                        <strong>{energy[index]}</strong>
                        <input
                          aria-label={`Energia ${item.label.toLowerCase()}`}
                          type="range"
                          min="1"
                          max="5"
                          value={energy[index]}
                          onChange={(event) =>
                            setEnergy(
                              (current) =>
                                current.map((value, itemIndex) =>
                                  itemIndex === index ? Number(event.target.value) : value,
                                ) as [number, number, number],
                            )
                          }
                        />
                      </label>
                    ))}
                  </section>
                )}
              </>
            )}
          </div>
          <div className="sheet-actions">
            {isView ? (
              <>
                <Button onClick={() => go("edit-task")}>Editar tarefa</Button>
                <Button variant="danger" onClick={() => setConfirmDelete(true)}>
                  <img src={`${A}/1d352.svg`} width="16" height="16" alt="" /> Excluir tarefa
                </Button>
              </>
            ) : (
              <>
                <Button onClick={submit}>{isCreate ? "Criar tarefa" : "Salvar alterações"}</Button>
                <Button variant="outline" onClick={() => go(isCreate ? "home" : "view-task")}>
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </main>
      </div>
      {confirmDelete && selectedTask && (
        <>
          <div className="dialog-scrim" onClick={() => setConfirmDelete(false)} />
          <section
            className="confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
          >
            <button className="close" onClick={() => setConfirmDelete(false)} aria-label="Fechar">
              ×
            </button>
            <h2 id="delete-title">Excluir tarefa?</h2>
            <p>
              Esta ação excluirá <strong>“{selectedTask.name}”</strong> do seu dia.
            </p>
            <Button variant="danger" onClick={() => deleteTask(selectedTask.id)}>
              Sim, excluir tarefa
            </Button>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
          </section>
        </>
      )}
    </PageShell>
  );
}

function Agenda({
  go,
  tasks,
  openTask,
}: {
  go: (screen: Screen) => void;
  tasks: Task[];
  openTask: (id: number) => void;
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState("13");
  const days = [
    ["Seg", "11"],
    ["Ter", "12"],
    ["Qua", "13"],
    ["Qui", "14"],
    ["Sex", "15"],
    ["Sáb", "16"],
    ["Dom", "17"],
  ];
  return (
    <PageShell screen="agenda" go={go}>
      <main className="page-content section-page" id="main-content">
        <div className="section-title">
          <span>Planejamento</span>
          <h1>Agenda</h1>
          <p>Veja sua semana sem perder de vista sua energia.</p>
        </div>
        <section className="calendar-card">
          <div className="calendar-heading">
            <button
              onClick={() => setWeekOffset((value) => value - 1)}
              aria-label="Semana anterior"
            >
              ←
            </button>
            <strong>
              {weekOffset === 0
                ? "11 a 17 de maio"
                : weekOffset < 0
                  ? "4 a 10 de maio"
                  : "18 a 24 de maio"}
            </strong>
            <button onClick={() => setWeekOffset((value) => value + 1)} aria-label="Próxima semana">
              →
            </button>
          </div>
          <div className="week-grid">
            {days.map(([day, date]) => (
              <button
                className={date === selectedDate ? "selected" : ""}
                key={date}
                onClick={() => setSelectedDate(date)}
                aria-pressed={date === selectedDate}
              >
                <span>{day}</span>
                <strong>{date}</strong>
                {date === selectedDate && <i />}
              </button>
            ))}
          </div>
        </section>
        <div className="agenda-heading">
          <div>
            <h2>{selectedDate === "13" ? "Quarta-feira, 13" : `Dia ${selectedDate} de maio`}</h2>
            <p>{selectedDate === "13" ? tasks.length : 0} atividades planejadas</p>
          </div>
          <button className="round-add" onClick={() => go("create-task")} aria-label="Criar tarefa">
            ＋
          </button>
        </div>
        <section className="timeline">
          {selectedDate === "13" ? (
            tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => openTask(task.id)}
                className={task.completed ? "done" : ""}
              >
                <time>{task.time}</time>
                <span />
                <div>
                  <strong>{task.name}</strong>
                  <small>
                    {task.duration} · {task.effort} colheres
                  </small>
                </div>
              </button>
            ))
          ) : (
            <div className="agenda-empty">
              <strong>Nada planejado por aqui</strong>
              <span>Um dia livre também pode fazer parte da rotina.</span>
            </div>
          )}
        </section>
      </main>
    </PageShell>
  );
}

function Routine({ go }: { go: (screen: Screen) => void }) {
  const [added, setAdded] = useState<number[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [routineName, setRoutineName] = useState("");
  const [routines, setRoutines] = useState([
    {
      title: "Rotina da manhã",
      text: "Começar o dia com calma",
      count: 3,
      effort: 4,
      color: "lavender",
    },
    {
      title: "Preparar para o trabalho",
      text: "Uma transição previsível",
      count: 4,
      effort: 6,
      color: "mint",
    },
    {
      title: "Encerrar o dia",
      text: "Desacelerar antes de descansar",
      count: 3,
      effort: 3,
      color: "peach",
    },
  ]);
  const addRoutine = () => {
    setRoutines((current) => [
      ...current,
      {
        title: routineName.trim() || "Minha nova rotina",
        text: "Uma sequência personalizada",
        count: 3,
        effort: 4,
        color: "lavender",
      },
    ]);
    setRoutineName("");
    setShowBuilder(false);
  };
  return (
    <PageShell screen="routine" go={go}>
      <main className="page-content section-page routine-page" id="main-content">
        <div className="section-title">
          <span>Atalhos</span>
          <h1>Rotinas</h1>
          <p>Agrupe atividades que se repetem e economize decisões.</p>
        </div>
        <button
          className="create-routine"
          onClick={() => setShowBuilder((current) => !current)}
          aria-expanded={showBuilder}
        >
          <span>＋</span>
          <div>
            <strong>Criar nova rotina</strong>
            <small>Monte uma sequência do seu jeito</small>
          </div>
          <b>→</b>
        </button>
        {showBuilder && (
          <section className="routine-builder">
            <h2>Nova rotina</h2>
            <Field
              label="Nome da rotina"
              placeholder="Ex: Preparar para dormir"
              value={routineName}
              onChange={setRoutineName}
            />
            <p>Você poderá adicionar e ordenar as atividades depois de criar a rotina.</p>
            <Button onClick={addRoutine}>Criar rotina</Button>
          </section>
        )}
        {routines.map((routine, index) => (
          <section className={`routine-card routine-card--${routine.color}`} key={routine.title}>
            <div className="routine-card__heading">
              <div>
                <span className="routine-index">0{index + 1}</span>
                <h2>{routine.title}</h2>
                <p>{routine.text}</p>
              </div>
              <button
                onClick={() =>
                  setRoutines((current) => current.filter((_, itemIndex) => itemIndex !== index))
                }
                aria-label={`Excluir ${routine.title}`}
              >
                ×
              </button>
            </div>
            <div className="routine-summary">
              <span>{routine.count} atividades</span>
              <span>
                {routine.effort} colheres <SpoonIcon size={16} />
              </span>
            </div>
            <div className="routine-tasks">
              {initialTasks.slice(0, routine.count === 4 ? 3 : routine.count).map((task) => (
                <div key={`${routine.title}-${task.id}`}>
                  <time>{task.time}</time>
                  <strong>{task.name}</strong>
                </div>
              ))}
            </div>
            <Button
              variant={added.includes(index) ? "outline" : "primary"}
              onClick={() =>
                setAdded((current) =>
                  current.includes(index)
                    ? current.filter((item) => item !== index)
                    : [...current, index],
                )
              }
            >
              {added.includes(index) ? "Remover do meu dia" : "Adicionar ao meu dia"}
            </Button>
          </section>
        ))}
      </main>
    </PageShell>
  );
}

function Help({ go }: { go: (screen: Screen) => void }) {
  const [open, setOpen] = useState(0);
  const [query, setQuery] = useState("");
  const [messageStarted, setMessageStarted] = useState(false);
  const faqs = [
    [
      "O que são as colheres?",
      "Colheres são uma forma visual de estimar a energia que uma atividade pode exigir. Elas ajudam a comparar demandas e planejar pausas, sem funcionar como avaliação médica.",
    ],
    [
      "Como definir o esforço de uma tarefa?",
      "Pense em como você está hoje. Uma mesma tarefa pode exigir níveis diferentes de energia em dias diferentes, e tudo bem ajustar depois.",
    ],
    [
      "Posso mudar uma tarefa concluída?",
      "Sim. Na tela Hoje, toque no marcador da tarefa concluída para devolvê-la às atividades pendentes.",
    ],
    [
      "Para que servem as três energias?",
      "As energias cognitiva, sensorial e social ajudam a perceber que tipos de demanda estão mais presentes em cada atividade.",
    ],
  ];
  return (
    <PageShell screen="help" go={go}>
      <main className="page-content section-page help-page" id="main-content">
        <div className="section-title">
          <span>Centro de apoio</span>
          <h1>Como podemos ajudar?</h1>
          <p>Encontre respostas no seu tempo e sem linguagem complicada.</p>
        </div>
        <label className="search-box">
          <span>⌕</span>
          <input
            placeholder="Buscar uma dúvida"
            aria-label="Buscar na ajuda"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <section className="help-feature">
          <span className="brand__icon">
            <SpoonIcon />
          </span>
          <div>
            <h2>Entenda as suas colheres</h2>
            <p>Um guia rápido sobre energia, esforço e planejamento.</p>
          </div>
        </section>
        <section className="faq-list">
          <h2>Perguntas frequentes</h2>
          {faqs
            .filter(([question, answer]) =>
              `${question} ${answer}`.toLowerCase().includes(query.toLowerCase()),
            )
            .map(([question, answer], index) => (
              <div className="faq-item" key={question}>
                <button
                  onClick={() => setOpen(open === index ? -1 : index)}
                  aria-expanded={open === index}
                >
                  <strong>{question}</strong>
                  <span>{open === index ? "−" : "+"}</span>
                </button>
                {open === index && <p>{answer}</p>}
              </div>
            ))}
        </section>
        <section className="contact-card">
          <div>
            <h2>Ainda precisa de ajuda?</h2>
            <p>Fale com a equipe de suporte. Respondemos em até 2 dias úteis.</p>
          </div>
          <Button variant="outline" onClick={() => setMessageStarted(true)}>
            {messageStarted ? "Mensagem iniciada — responderemos em breve" : "Enviar uma mensagem"}
          </Button>
        </section>
      </main>
    </PageShell>
  );
}

function Settings({ go }: { go: (screen: Screen) => void }) {
  const [reminders, setReminders] = useState(true);
  const [pause, setPause] = useState(true);
  const [contrast, setContrast] = useState(false);
  const [budget, setBudget] = useState(12);
  const [largeText, setLargeText] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("Marina");
  return (
    <PageShell screen="settings" go={go}>
      <main
        id="main-content"
        className={`page-content section-page settings-page ${contrast ? "high-contrast" : ""} ${largeText ? "large-text" : ""} ${reduceMotion ? "reduce-motion" : ""}`}
      >
        <div className="section-title">
          <span>Preferências</span>
          <h1>Ajustes</h1>
          <p>Personalize a experiência para ela funcionar melhor para você.</p>
        </div>
        <section className="settings-profile">
          <span className="profile-avatar">M</span>
          <div>
            {editingProfile ? (
              <input
                className="profile-name-input"
                value={profileName}
                onChange={(event) => setProfileName(event.target.value)}
                aria-label="Nome do perfil"
              />
            ) : (
              <strong>{profileName}</strong>
            )}
            <span>marina@email.com</span>
          </div>
          <button
            aria-label="Editar perfil"
            onClick={() => setEditingProfile((current) => !current)}
          >
            {editingProfile ? "Salvar" : "Editar"}
          </button>
        </section>
        <section className="settings-group">
          <h2>Planejamento</h2>
          <SettingToggle
            label="Lembretes de tarefas"
            description="Receber avisos no horário planejado"
            checked={reminders}
            setChecked={setReminders}
          />
          <SettingToggle
            label="Sugestões de pausa"
            description="Mostrar pausas entre atividades"
            checked={pause}
            setChecked={setPause}
          />
          <button
            className="setting-link"
            onClick={() => setBudget((current) => (current >= 16 ? 8 : current + 2))}
          >
            <div>
              <strong>Orçamento diário</strong>
              <span>{budget} colheres por dia · toque para ajustar</span>
            </div>
            <b>›</b>
          </button>
        </section>
        <section className="settings-group">
          <h2>Acessibilidade</h2>
          <SettingToggle
            label="Contraste reforçado"
            description="Aumentar a separação entre elementos"
            checked={contrast}
            setChecked={setContrast}
          />
          <button className="setting-link" onClick={() => setLargeText((current) => !current)}>
            <div>
              <strong>Tamanho do texto</strong>
              <span>{largeText ? "Ampliado" : "Padrão"}</span>
            </div>
            <b>›</b>
          </button>
          <button className="setting-link" onClick={() => setReduceMotion((current) => !current)}>
            <div>
              <strong>Reduzir movimento</strong>
              <span>{reduceMotion ? "Ativado" : "Desativado"}</span>
            </div>
            <b>›</b>
          </button>
        </section>
        <section className="settings-group">
          <h2>Conta</h2>
          <button
            className="setting-link"
            onClick={() => setShowPrivacy((current) => !current)}
            aria-expanded={showPrivacy}
          >
            <div>
              <strong>Privacidade e dados</strong>
              <span>Gerencie suas informações</span>
            </div>
            <b>›</b>
          </button>
          {showPrivacy && (
            <p className="privacy-note">
              Seus dados de planejamento ficam vinculados à sua conta. Você pode solicitar uma cópia
              ou exclusão pelo suporte.
            </p>
          )}
          <button className="setting-link danger-link" onClick={() => go("login")}>
            <div>
              <strong>Sair da conta</strong>
            </div>
            <b>›</b>
          </button>
        </section>
      </main>
    </PageShell>
  );
}

function SettingToggle({
  label,
  description,
  checked,
  setChecked,
}: {
  label: string;
  description: string;
  checked: boolean;
  setChecked: (checked: boolean) => void;
}) {
  return (
    <div className="setting-toggle">
      <div>
        <strong>{label}</strong>
        <span>{description}</span>
      </div>
      <button
        className={checked ? "on" : ""}
        onClick={() => setChecked(!checked)}
        role="switch"
        aria-checked={checked}
        aria-label={label}
      >
        <i />
      </button>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const history = useRef<Screen[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setScreen("login"), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const go = (next: Screen) => {
    if (next === screen) return;
    history.current.push(screen);
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => setScreen(history.current.pop() ?? "login");
  const openTask = (id: number) => {
    setSelectedId(id);
    go("view-task");
  };
  const selectedTask = tasks.find((task) => task.id === selectedId);
  const saveTask = (task: Task) => {
    setTasks((current) =>
      current.some((item) => item.id === task.id)
        ? current.map((item) => (item.id === task.id ? task : item))
        : [...current, task].sort((a, b) => a.time.localeCompare(b.time)),
    );
    setSelectedId(task.id);
    setScreen("home");
  };
  const deleteTask = (id: number) => {
    setTasks((current) => current.filter((task) => task.id !== id));
    setSelectedId(null);
    setScreen("home");
  };

  if (screen === "splash")
    return (
      <main className="splash">
        <span>Spoon</span>
        <SpoonIcon light size={44} />
      </main>
    );
  if (screen === "login")
    return (
      <AuthPage className="login-page">
        <div className="login-banner">
          <div className="login-art">
            <span />
            <span />
            <span />
            <SpoonIcon size={44} />
          </div>
        </div>
        <section className="auth-content login-content">
          <div>
            <h1 className="with-spoon">
              Bem-vindo ao Spoon! <SpoonIcon size={24} />
            </h1>
            <p>Planeje suas atividades respeitando seus limites.</p>
          </div>
          <div className="fields">
            <Field label="Email:" placeholder="Insira seu email" type="email" />
            <Field label="Senha:" placeholder="Digite sua senha" type="password" />
            <button className="text-link right" onClick={() => go("forgot")}>
              Esqueci minha senha
            </button>
          </div>
          <Button onClick={() => go("home")}>Entrar</Button>
          <div className="auth-alternative">
            <p>Ainda não tem uma conta?</p>
            <Button variant="outline" onClick={() => go("signup")}>
              Criar uma conta
            </Button>
          </div>
        </section>
      </AuthPage>
    );
  if (screen === "signup")
    return (
      <AuthPage>
        <section className="auth-content signup-content">
          <div>
            <BackButton onClick={back} />
            <h1>Comece agora</h1>
            <p>Essas informações podem ser mudadas a qualquer momento.</p>
          </div>
          <div className="fields">
            <Field label="Como gostaria de ser chamad@?" placeholder="Insira seu nome ou apelido" />
            <Field label="Email:" placeholder="Insira seu email" type="email" />
            <Field label="Senha:" placeholder="Digite sua senha" type="password" />
            <PasswordRequirements />
          </div>
          <div>
            <Button onClick={() => go("home")}>Confirmar</Button>
            <p className="terms">
              Ao clicar em “Confirmar” você declara que concorda com os{" "}
              <u>Termos de uso e Privacidade.</u>
            </p>
          </div>
          <div className="auth-alternative">
            <p>Já tem conta?</p>
            <Button variant="outline" onClick={() => go("login")}>
              Fazer login
            </Button>
          </div>
        </section>
      </AuthPage>
    );
  if (screen === "forgot")
    return (
      <AuthPage>
        <section className="auth-content recover-content">
          <BackButton onClick={back} />
          <div>
            <h1>Esqueceu sua senha?</h1>
            <p>Escreva seu email cadastrado e enviaremos um código para criar uma nova senha.</p>
          </div>
          <Field label="Email:" placeholder="Insira seu email" type="email" />
          <Button onClick={() => go("code")}>Confirmar</Button>
        </section>
      </AuthPage>
    );
  if (screen === "code")
    return (
      <AuthPage>
        <section className="auth-content code-content">
          <BackButton onClick={back} />
          <h1>Insira o código recebido no email:</h1>
          <div className="code-fields">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <input key={item} aria-label={`Dígito ${item + 1}`} maxLength={1} />
            ))}
          </div>
          <div className="fields resend">
            <Button onClick={() => go("new-password")}>Confirmar</Button>
            <Button variant="outline">Reenviar código</Button>
          </div>
        </section>
      </AuthPage>
    );
  if (screen === "new-password")
    return (
      <AuthPage>
        <section className="auth-content new-password-content">
          <BackButton onClick={back} />
          <div>
            <h1>Crie sua nova senha</h1>
            <p>Lembre-se: não repita as últimas 5 senhas.</p>
          </div>
          <div className="fields">
            <Field label="Senha:" placeholder="Digite sua senha" type="password" />
            <PasswordRequirements />
            <Field
              label="Confirmar senha:"
              placeholder="Digite sua senha novamente"
              type="password"
            />
          </div>
          <Button onClick={() => go("login")}>Confirmar</Button>
        </section>
      </AuthPage>
    );
  if (screen === "home")
    return <Home go={go} tasks={tasks} setTasks={setTasks} openTask={openTask} />;
  if (screen === "agenda") return <Agenda go={go} tasks={tasks} openTask={openTask} />;
  if (screen === "routine") return <Routine go={go} />;
  if (screen === "help") return <Help go={go} />;
  if (screen === "settings") return <Settings go={go} />;
  return (
    <TaskSheet
      screen={screen}
      go={go}
      selectedTask={selectedTask}
      saveTask={saveTask}
      deleteTask={deleteTask}
    />
  );
}
