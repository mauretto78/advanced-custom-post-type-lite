<?php

namespace ACPT_Lite\Includes;

class ACPT_Lite_Loader
{
    /**
     * @var array<int, array<string, mixed>>
     */
    private array $actions = [];

    /**
     * @var array<int, array<string, mixed>>
     */
    private array $filters = [];

    /**
     * @param string $hook
     * @param object $component
     * @param string $callback
     * @param int    $priority
     * @param int    $accepted_args
     */
    public function addAction(string $hook, object $component, string $callback, int $priority = 10, int $accepted_args = 1): void
    {
        $this->actions[] = $this->createHook($hook, $component, $callback, $priority, $accepted_args);
    }

    /**
     * @param string $hook
     * @param object $component
     * @param string $callback
     * @param int    $priority
     * @param int    $accepted_args
     */
    public function addFilter(string $hook, object $component, string $callback, int $priority = 10, int $accepted_args = 1): void
    {
        $this->filters[] = $this->createHook($hook, $component, $callback, $priority, $accepted_args);
    }

    /**
     * @param string $hook
     * @param object $component
     * @param string $callback
     * @param int    $priority
     * @param int    $accepted_args
     * @return array<string, mixed>
     */
    private function createHook(string $hook, object $component, string $callback, int $priority, int $accepted_args): array
    {
        return [
                'hook'          => $hook,
                'component'     => $component,
                'callback'      => $callback,
                'priority'      => $priority,
                'accepted_args' => $accepted_args
        ];
    }

    public function run(): void
    {
        foreach ($this->filters as $hook) {
            $this->callAddAction($hook);
        }

        foreach ($this->actions as $hook) {
            $this->callAddAction($hook);
        }
    }

    /**
     * @param array<string, mixed> $hook
     */
    private function callAddAction(array $hook): void
    {
        if (is_callable($hook['callback'])) {
            add_action($hook['hook'], $hook['callback'], $hook['priority'], $hook['accepted_args']);
        } else {
            $callback = [$hook['component'], $hook['callback']];

            if (is_callable($callback)) {
                add_action($hook['hook'], $callback, $hook['priority'], $hook['accepted_args']);
            }
        }
    }
}
