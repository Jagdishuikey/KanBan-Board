import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TaskInput from './TaskInput'

describe('TaskInput Component', () => {
    it('renders input and button', () => {
        render(<TaskInput onAddTask={() => { }} />)
        expect(screen.getByPlaceholderText('Enter a new task...')).toBeInTheDocument()
        expect(screen.getByText('Add Task')).toBeInTheDocument()
    })

    it('updates input value on change', () => {
        render(<TaskInput onAddTask={() => { }} />)
        const input = screen.getByPlaceholderText('Enter a new task...')
        fireEvent.change(input, { target: { value: 'New Task' } })
        expect(input.value).toBe('New Task')
    })

    it('calls onAddTask when button is clicked with valid input', () => {
        const handleAddTask = vi.fn()
        render(<TaskInput onAddTask={handleAddTask} />)

        const input = screen.getByPlaceholderText('Enter a new task...')
        fireEvent.change(input, { target: { value: 'New Task' } })

        const button = screen.getByText('Add Task').closest('button')
        fireEvent.click(button)

        expect(handleAddTask).toHaveBeenCalledWith('New Task')
        expect(input.value).toBe('') // Should clear input
    })

    it('does not call onAddTask when input is empty', () => {
        const handleAddTask = vi.fn()
        render(<TaskInput onAddTask={handleAddTask} />)

        const button = screen.getByText('Add Task').closest('button')
        fireEvent.click(button)

        expect(handleAddTask).not.toHaveBeenCalled()
    })
})
