"use client"

import { useState, useEffect } from 'react'
import {
    Search,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    UserCheck,
    UserX,
    Filter,
    Download,
    Upload,
    Shield,
    User as UserIcon,
    Mail,
    Calendar,
    Activity
} from 'lucide-react'
import { Button } from '@/components/ui-shadcn/button'
import { Input } from '@/components/ui-shadcn/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui-shadcn/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui-shadcn/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui-shadcn/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui-shadcn/dialog'
import { Label } from '@/components/ui-shadcn/label'
import { Badge } from '@/components/ui-shadcn/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-shadcn/card'
import { Avatar, AvatarFallback } from '@/components/ui-shadcn/avatar'
import { Separator } from '@/components/ui-shadcn/separator'
import { UserService } from '@/lib/services/user/user.service'
import { UserResponse, UserRequest, UserRole } from '@/lib/types/user/user.type'
import { useAuth } from '@/lib/contexts/AuthContext'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const ROLE_LABELS = {
    [UserRole.ADMIN]: 'Administrador',
    [UserRole.DENTISTA]: 'Dentista',
    [UserRole.RECEPCIONISTA]: 'Recepcionista',
    [UserRole.USER]: 'Usuário',
    [UserRole.PACIENTE]: 'Paciente',
}

const ROLE_COLORS = {
    [UserRole.ADMIN]: 'bg-purple-100 text-purple-800 border-purple-300',
    [UserRole.DENTISTA]: 'bg-blue-100 text-blue-800 border-blue-300',
    [UserRole.RECEPCIONISTA]: 'bg-green-100 text-green-800 border-green-300',
    [UserRole.USER]: 'bg-gray-100 text-gray-800 border-gray-300',
    [UserRole.PACIENTE]: 'bg-orange-100 text-orange-800 border-orange-300',
}

export default function UsersPage() {
    const { token } = useAuth()
    const [users, setUsers] = useState<UserResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)

    // Modais
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)

    // Form
    const [formData, setFormData] = useState<UserRequest>({
        nome: '',
        username: '',
        email: '',
        senha: '',
        role: UserRole.USER,
        ativo: true
    })

    // Estatísticas
    const [stats, setStats] = useState({
        total: 0,
        ativos: 0,
        inativos: 0,
        porRole: {} as Record<UserRole, number>
    })

    useEffect(() => {
        loadUsers()
        loadStats()
    }, [page, searchTerm, roleFilter, statusFilter])

    const loadUsers = async () => {
        if (!token) return

        setLoading(true)
        try {
            let response

            if (searchTerm) {
                response = await UserService.buscar(searchTerm, page, 20, token)
            } else if (roleFilter !== 'all') {
                response = await UserService.listarPorRole(roleFilter as UserRole, page, 20, token)
            } else if (statusFilter !== 'all') {
                response = await UserService.listarPorStatus(statusFilter === 'active', page, 20, token)
            } else {
                response = await UserService.listarTodos(page, 20, token)
            }

            setUsers(response.content)
            setTotalPages(response.totalPages)
            setTotalElements(response.totalElements)
        } catch (error) {
            toast.error('Erro ao carregar usuários')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const loadStats = async () => {
        if (!token) return

        try {
            const data = await UserService.estatisticas(token)
            setStats(data)
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error)
        }
    }

    const handleCreate = async () => {
        if (!token) return

        try {
            await UserService.criar(formData, token)
            toast.success('Usuário criado com sucesso!')
            setCreateModalOpen(false)
            resetForm()
            loadUsers()
            loadStats()
        } catch (error) {
            toast.error('Erro ao criar usuário')
            console.error(error)
        }
    }

    const handleEdit = async () => {
        if (!token || !selectedUser) return

        try {
            await UserService.atualizar(selectedUser.id, formData, token)
            toast.success('Usuário atualizado com sucesso!')
            setEditModalOpen(false)
            resetForm()
            loadUsers()
        } catch (error) {
            toast.error('Erro ao atualizar usuário')
            console.error(error)
        }
    }

    const handleDelete = async () => {
        if (!token || !selectedUser) return

        try {
            await UserService.deletar(selectedUser.id, token)
            toast.success('Usuário deletado com sucesso!')
            setDeleteModalOpen(false)
            setSelectedUser(null)
            loadUsers()
            loadStats()
        } catch (error) {
            toast.error('Erro ao deletar usuário')
            console.error(error)
        }
    }

    const handleToggleStatus = async (user: UserResponse) => {
        if (!token) return

        try {
            if (user.ativo) {
                await UserService.inativar(user.id, token)
                toast.success('Usuário inativado')
            } else {
                await UserService.ativar(user.id, token)
                toast.success('Usuário ativado')
            }
            loadUsers()
            loadStats()
        } catch (error) {
            toast.error('Erro ao alterar status')
            console.error(error)
        }
    }

    const openEditModal = (user: UserResponse) => {
        setSelectedUser(user)
        setFormData({
            nome: user.nome,
            username: user.username,
            email: user.email,
            senha: '',
            role: user.role,
            ativo: user.ativo
        })
        setEditModalOpen(true)
    }

    const openDeleteModal = (user: UserResponse) => {
        setSelectedUser(user)
        setDeleteModalOpen(true)
    }

    const resetForm = () => {
        setFormData({
            nome: '',
            username: '',
            email: '',
            senha: '',
            role: UserRole.USER,
            ativo: true
        })
        setSelectedUser(null)
    }

    const getInitials = (nome: string) => {
        return nome
            .split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
                        <p className="text-gray-600 mt-1">Gerencie todos os usuários do sistema</p>
                    </div>
                    <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Novo Usuário
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">Total de Usuários</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold text-gray-900">{stats.total}</span>
                                <UserIcon className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">Usuários Ativos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold text-green-600">{stats.ativos}</span>
                                <UserCheck className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">Usuários Inativos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold text-red-600">{stats.inativos}</span>
                                <UserX className="h-8 w-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">Administradores</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold text-purple-600">{stats.porRole?.[UserRole.ADMIN] || 0}</span>
                                <Shield className="h-8 w-8 text-purple-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar por nome, email ou username..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Filtrar por cargo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os Cargos</SelectItem>
                                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Filtrar por status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os Status</SelectItem>
                                    <SelectItem value="active">Ativos</SelectItem>
                                    <SelectItem value="inactive">Inativos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Usuário</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Cargo</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Último Login</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <div className="flex items-center justify-center gap-2">
                                                <Activity className="h-4 w-4 animate-spin" />
                                                Carregando...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            Nenhum usuário encontrado
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                                                            {getInitials(user.nome)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{user.nome}</p>
                                                        <p className="text-sm text-gray-500">@{user.username}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm">{user.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={ROLE_COLORS[user.role]}>
                                                    {ROLE_LABELS[user.role]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.ativo ? "default" : "secondary"}>
                                                    {user.ativo ? 'Ativo' : 'Inativo'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="h-4 w-4" />
                                                    {user.ultimoLogin
                                                        ? format(new Date(user.ultimoLogin), "dd/MM/yyyy HH:mm", { locale: ptBR })
                                                        : 'Nunca'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => openEditModal(user)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                                                            {user.ativo ? (
                                                                <>
                                                                    <UserX className="h-4 w-4 mr-2" />
                                                                    Inativar
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <UserCheck className="h-4 w-4 mr-2" />
                                                                    Ativar
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => openDeleteModal(user)}
                                                            className="text-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Deletar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Mostrando {users.length} de {totalElements} usuários
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                            >
                                Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page === totalPages - 1}
                            >
                                Próxima
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={createModalOpen || editModalOpen} onOpenChange={(open) => {
                if (!open) {
                    setCreateModalOpen(false)
                    setEditModalOpen(false)
                    resetForm()
                }
            }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editModalOpen ? 'Editar Usuário' : 'Novo Usuário'}
                        </DialogTitle>
                        <DialogDescription>
                            {editModalOpen
                                ? 'Atualize as informações do usuário'
                                : 'Preencha os dados para criar um novo usuário'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="nome">Nome Completo *</Label>
                            <Input
                                id="nome"
                                value={formData.nome}
                                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                                placeholder="João da Silva"
                            />
                        </div>

                        <div>
                            <Label htmlFor="username">Username *</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                placeholder="joaosilva"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="joao@example.com"
                            />
                        </div>

                        <div>
                            <Label htmlFor="senha">Senha {editModalOpen && '(deixe vazio para não alterar)'}</Label>
                            <Input
                                id="senha"
                                type="password"
                                value={formData.senha}
                                onChange={(e) => setFormData({...formData, senha: e.target.value})}
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <Label htmlFor="role">Cargo *</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => setFormData({...formData, role: value as UserRole})}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setCreateModalOpen(false)
                            setEditModalOpen(false)
                            resetForm()
                        }}>
                            Cancelar
                        </Button>
                        <Button onClick={editModalOpen ? handleEdit : handleCreate}>
                            {editModalOpen ? 'Atualizar' : 'Criar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja deletar o usuário <strong>{selectedUser?.nome}</strong>?
                            Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Deletar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}