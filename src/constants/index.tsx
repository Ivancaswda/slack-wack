export const dummyContent = [
    {
        title: "Эффективная коммуникация с Wack",
        description: (
            <>
                <p>
                    Wack помогает вашей команде оставаться на связи и эффективно взаимодействовать, независимо от того, где вы находитесь. Объединяйте чаты, каналы и видеозвонки в одном месте, чтобы работа шла быстрее и проще.
                </p>
                <p>
                    Создавайте рабочие пространства под проекты, следите за задачами и делитесь файлами мгновенно. Wack делает коллаборацию прозрачной и понятной.
                </p>
                <p>
                    Настройте уведомления и интеграции под ваши потребности, чтобы ничего не упустить. Wack адаптируется под вашу команду.
                </p>
            </>
        ),
        badge: "Командная работа",
        image:
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=3540&ixlib=rb-4.0.3",
    },
    {
        title: "Прозрачность и контроль",
        description: (
            <>
                <p>
                    Wack позволяет видеть прогресс задач и действий всей команды в режиме реального времени. Все сообщения и документы централизованы, чтобы минимизировать потерю информации.
                </p>
                <p>
                    Контролируйте доступ к каналам и документам, назначайте роли и права, чтобы работа шла без лишней путаницы. Wack делает управление проектами интуитивным.
                </p>
            </>
        ),
        badge: "Управление проектами",
        image:
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=3540&ixlib=rb-4.0.3",
    },
    {
        title: "Интеграции и расширения",
        description: (
            <>
                <p>
                    Wack поддерживает интеграцию с популярными сервисами для повышения продуктивности. Подключайте календарь, облачные хранилища, таск-менеджеры и другие инструменты прямо внутри Wack.
                </p>
                <p>
                    Автоматизация процессов и удобные уведомления помогают сосредоточиться на действительно важных задачах. Wack объединяет ваши инструменты в одном приложении.
                </p>
            </>
        ),
        badge: "Интеграции",
        image:
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=3506&ixlib=rb-4.0.3",
    },
];


export const testimonials = [
    {
        quote:
            "Wack полностью изменил наш способ коммуникации в команде. Все проекты, чаты и файлы теперь в одном месте — работать стало гораздо проще.",
        name: "Анна Петрова",
        title: "Project Manager, TechCorp",
    },
    {
        quote:
            "Благодаря Wack мы ускорили процесс принятия решений. Интеграции с календарями и таск-менеджерами сделали нашу работу плавной и прозрачной.",
        name: "Иван Смирнов",
        title: "Team Lead, DevSolutions",
    },
    {
        quote:
            "Наконец-то единое место для всей команды! Wack позволяет отслеживать прогресс задач и держать всех в курсе событий.",
        name: "Мария Иванова",
        title: "Product Owner, StartupHub",
    },
    {
        quote:
            "Wack – это настоящее спасение для удаленной работы. Видео, чат и файлы под рукой, без лишних приложений.",
        name: "Алексей Кузнецов",
        title: "Software Engineer, CloudWorks",
    },
    {
        quote:
            "Мы попробовали несколько инструментов для командной работы, но только Wack объединил все наши нужды в одном удобном интерфейсе.",
        name: "Екатерина Федорова",
        title: "Operations Manager, GlobalTech",
    },
];
export const DummyContent = ({ src, children }: { src: string; children: React.ReactNode }) => {
    return (
        <div className="w-full h-full relative rounded-xl overflow-hidden">
            <img
                src={src}
                alt="tab background"
                className="w-full h-full object-cover absolute top-0 left-0"
            />
            <div className="relative z-10 p-10 text-white backdrop-brightness-75 h-full flex flex-col justify-center">
                {children}
            </div>
        </div>
    );
};

export const tabs = [
    {
        title: "Продукты",
        value: "product",
        content: (
            <DummyContent src="/slack-image-1.webp">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
                    Wack Продукты
                </h2>
                <p className="text-lg md:text-xl">
                    Централизованная платформа для командной работы и обмена файлами.
                </p>
            </DummyContent>
        ),
    },
    {
        title: "Что от нас хотят?",
        value: "services",
        content: (
            <DummyContent src="/slack-image-2.jpg">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
                    Наши услуги
                </h2>
                <p className="text-lg md:text-xl">
                    Интеграции с календарями, таск-менеджерами и облачными сервисами.
                </p>
            </DummyContent>
        ),
    },
    {
        title: "Playground",
        value: "playground",
        content: (
            <DummyContent src="/slack-image-3.webp">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
                   Наш Плэйграунд
                </h2>
                <p className="text-lg md:text-xl">
                    Тестируйте функции Wack в безопасной песочнице.
                </p>
            </DummyContent>
        ),
    },
    {
        title: "Что у вас нового?",
        value: "content",
        content: (
            <DummyContent src="/slack-image-4.webp">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
                    Контент
                </h2>
                <p className="text-lg md:text-xl">
                    Централизованное хранение и управление документами и медиа.
                </p>
            </DummyContent>
        ),
    },
    {
        title: "Веселись!",
        value: "random",
        content: (
            <DummyContent src="/slack-image-5.jpg">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
                   Получай удовольствие
                </h2>
                <p className="text-lg md:text-xl">
                    Вдохновляющие цитаты, советы и внутренняя статистика команды.
                </p>
            </DummyContent>
        ),
    },
];