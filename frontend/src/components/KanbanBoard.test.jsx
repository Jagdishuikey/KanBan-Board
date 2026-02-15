import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import KanbanBoard from './KanbanBoard'
import { socket } from '../socket'
import React from 'react'

// Mock socket.io-client
vi.mock('../socket', () => ({
    socket: {
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
    },
}))

// Mock DndProvider (React DnD) because it's needed for TaskList
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const MockKanbanBoard = () => (
    <DndProvider backend={HTML5Backend}>
        <KanbanBoard />
    </DndProvider>
)

describe('KanbanBoard Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders and subscribes to sync:tasks', () => {
        render(<MockKanbanBoard />)

        expect(screen.getByText('Kanban Board')).toBeInTheDocument()
        expect(socket.on).toHaveBeenCalledWith('sync:tasks', expect.any(Function))
    })

    it('displays tasks received from backend', async () => {
        const mockTasks = [
            { id: 1, title: 'Test Task 1', status: 'todo' },
            { id: 2, title: 'Test Task 2', status: 'inprogress' },
        ]

        // Simulate receiving data
        socket.on.mockImplementation((event, callback) => {
            if (event === 'sync:tasks') {
                callback(mockTasks)
            }
        })

        render(<MockKanbanBoard />)

        // Check if tasks appear in the correct columns
        await waitFor(() => {
            expect(screen.getByText('Test Task 1')).toBeInTheDocument()
            expect(screen.getByText('Test Task 2')).toBeInTheDocument()
        })
    })
})
