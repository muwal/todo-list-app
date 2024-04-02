import React, { Component } from 'react';
import { Modal } from 'flowbite';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import iconBack from '../assets/icon-back.svg';
import iconEdit from '../assets/icon-edit.svg';
import iconSort from '../assets/icon-sort.svg';
import iconAngle from '../assets/icon-angle.svg';
import IconPlus from '../assets/icon-plus.svg';
import IconDelete from '../assets/icon-delete.svg';
import iconAlert from '../assets/icon-alert.svg';
import iconAlertSm from '../assets/icon-alert-sm.svg';
import emptyItem from '../assets/empty-item.png';

const bareUrl = 'https://todo.api.devcode.gethired.id/';

class Detail extends Component {
    queryParams = new URLSearchParams(window.location.search);
    activitiesId = this.queryParams.get('id');

    constructor(props) {
        super(props);
        this.state = {
            todos: [],
            activityTitle: '',
            editItem: {},
            isEdit: false,
            isEditItem: false,
            classDropdownSort: 'hidden',
            classDropdownPriority: 'hidden',
            message: null,
            todoId: null,
            todoTitle: null,
            textValue: '',
            isSaving: false,
            dataArray: [],
        };
        this.priorities = [
            { priority: 'Very High', value: 'very-high', color: 'bg-red-500' },
            { priority: 'High', value: 'high', color: 'bg-amber-500' },
            { priority: 'Medium', value: 'normal', color: 'bg-green-500' },
            { priority: 'Low', value: 'low', color: 'bg-blue-500' },
            { priority: 'Very Low', value: 'very-low', color: 'bg-purple-500' },
        ];
        this.addTodoModal = null;
        this.successModal = null;
        this.removeTodoModal = null;
    }

    componentDidMount() {
        this.getAllTodos();
        this.getActivities();
        this.initializeModals();

        console.log(this.props)
    }

    getAllTodos = async () => {
        try {
            const response = await axios.get(bareUrl + 'todo-items?activity_group_id=' + this.activitiesId);
            this.setState({ todos: response.data.data });
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    }

    getActivities = async () => {
        try {
            const response = await axios.get(bareUrl + 'activity-groups/' + this.activitiesId);
            this.setState({ activityTitle: response.data.title });
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    }

    initializeModals = () => {
        this.addTodoModal = new Modal(document.getElementById('addTodoModal'), {
            backdropClasses: 'modal-backdrop',
            onHide: () => this.removeBackdrop(),
        });

        this.successModal = new Modal(document.getElementById('successModal'), {
            closable: true,
            backdropClasses: 'modal-backdrop',
            onHide: () => this.removeBackdrop(),
        });

        this.removeTodoModal = new Modal(document.getElementById('removeTodoModal'), {
            closable: true,
            backdropClasses: 'modal-backdrop',
            onHide: () => this.removeBackdrop(),
        });
    }

    removeBackdrop = () => {
        const backdrop = document.querySelectorAll('.modal-backdrop');
        backdrop.forEach(box => {
            box.remove();
        });
    }

    handleSortOrderChange = (value) => {
        this.setState(prevState => ({ ...prevState, sortOrder: value, classDropdownSort: 'hidden' }));
        this.sortData(value);
    };

    handleItemChange = (item) => {
        this.setState(prevState => ({ ...prevState, dataArray: item, classDropdownPriority: 'hidden' }));
    };

    sortData = (order) => {
        let sortedTodos = [...this.state.todos];
        switch (order) {
            case "oldest":
                sortedTodos.sort((a, b) => a.id - b.id);
                break;
            case "asc":
                sortedTodos.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
                break;
            case "desc":
                sortedTodos.sort((a, b) => b.title.toLowerCase().localeCompare(a.title.toLowerCase()));
                break;
            case "unchecked":
                sortedTodos.sort((a, b) => a.is_active - b.is_active);
                break;
            default:
                sortedTodos.sort((a, b) => b.id - a.id);
                break;
        }
        this.setState(prevState => ({ ...prevState, todos: sortedTodos, sortOrder: order }));
    };

    showDropdownPriority = () => {
        this.setState((prevState) => ({
            ...prevState,
            classDropdownPriority: 'block'
        }))
    };

    hideDropdownPriority = () => {
        this.setState((prevState) => ({
            ...prevState,
            classDropdownPriority: 'hidden'
        }))
    };

    showDropdownSort = () => {
        this.setState((prevState) => ({
            ...prevState,
            classDropdownSort: 'block'
        }))
    };

    hideDropdownSort = () => {
        this.setState((prevState) => ({
            ...prevState,
            classDropdownSort: 'hidden'
        }))
    };

    displayTodos = (todos) => {
        if (!todos) {
            return false;
        }

        if (todos.length > 0) {
            return (
                todos.map((item, index) => {
                    var warna = '';

                    if (item.priority == 'very-high') {
                        warna = 'bg-red-500';
                    } else if (item.priority == 'high') {
                        warna = 'bg-amber-500';
                    } else if (item.priority == 'normal') {
                        warna = 'bg-green-500';
                    } else if (item.priority == 'low') {
                        warna = 'bg-blue-500';
                    } else if (item.priority == 'very-low') {
                        warna = 'bg-purple-500';
                    }
                    return (
                        <div className="bg-white rounded-2xl shadow-md p-8 flex items-center" key={index} data-cy="todo-item">
                            <input type="checkbox" className="mr-6 h-5 w-5 checked:bg-cyan" id={'todoItem' + index} data-cy="todo-item-checkbox" onChange={() => { this.toggleStatus(item) }} checked={!item.is_active} />
                            <div className={`h-3 w-3 mr-4 rounded-full ` + warna} data-cy="todo-item-priority-indicator"></div>
                            <div className={item.is_active ? 'font-semibold text-lg' : 'font-semibold text-lg line-through text-slate-500'} data-cy="todo-item-title">
                                {item.title}
                            </div>
                            <button data-cy="todo-item-edit-button" onClick={() => { this.editTodo(item) }} className='ml-3'>
                                <img src={iconEdit} alt="icon edit" />
                            </button>
                            <button onClick={() => this.showDeleteTodoModal(item)} data-cy="todo-item-delete-button" className='ml-auto'>
                                <img src={IconDelete} alt="icon delete" />
                            </button>
                        </div>
                    );
                })
            )
        } else {
            return (
                <img src={emptyItem} alt="empty" className="mx-auto" data-cy="todo-empty-state" />
            );
        }
    }

    handleSave = async () => {
        try {
            this.setState(prevState => ({
                ...prevState,
                isSaving: true
            }));

            let response;
            if (this.state.isEditItem) {
                response = await axios.patch(bareUrl + 'todo-items/' + this.state.editItem.id, {
                    title: this.state.textValue,
                    priority: this.state.dataArray.value
                });
            } else {
                response = await axios.post(bareUrl + 'todo-items', {
                    activity_group_id: this.activitiesId,
                    title: this.state.textValue,
                    priority: this.state.dataArray.value
                });
            }

            this.setState(prevState => ({
                ...prevState,
                isSaving: false,
                textValue: '',
                message: 'Todo berhasil ditambahkan',
                dataArray: {},
                classDropdownPriority: 'hidden'
            }));
            await this.getAllTodos();
            this.addTodoModal.hide();
            this.successModal.show();
        } catch (error) {
            this.setState(prevState => ({
                ...prevState,
                isSaving: false
            }));
            console.error('Error saving todo:', error);
        }
    };

    handleAddTodo = () => {
        this.setState((prevState) => ({
            ...prevState,
            isEditItem: false,
            dataArray: {},
            textValue: '',
            classDropdownSort: 'hidden'
        }))

        this.addTodoModal.show()
    }

    handleCloseAdd = () => {
        this.addTodoModal.hide()
    }

    editTodo = (item) => {
        var priority = this.priorities.find((priority) => {
            return priority.value == item.priority
        })

        this.setState((prevState) => ({
            ...prevState,
            isEditItem: true,
            editItem: item,
            textValue: item.title,
            dataArray: priority,
        }));

        this.addTodoModal.show();
    }

    showDeleteTodoModal = (todo) => {

        this.setState((prevState) => ({
            ...prevState,
            todoId: todo.id,
            todoTitle: todo.title,
            classDropdownSort: 'hidden',
        }));

        this.removeTodoModal.show()
    }

    deleteTodo = async (id) => {
        try {
            await axios.delete(bareUrl + 'todo-items/' + id);
            this.setState(prevState => ({
                ...prevState,
                message: 'Item berhasil dihapus'
            }));
            await this.getAllTodos();
            this.removeTodoModal.hide();
            this.successModal.show();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    closeDeleteModal = () => {
        this.removeTodoModal.hide()
    }

    toggleStatus = (item) => {
        axios.patch(bareUrl + 'todo-items/' + item.id, {
            is_active: !item.is_active,
        })
            .then(response => {
                this.getAllTodos()
                console.log(response)
            })
    }

    updateActivity = () => {
        const url = `${bareUrl}activity-groups/${this.activitiesId}`;
        const requestData = { title: this.state.activityTitle };

        axios.patch(url, requestData)
            .then(response => {
                this.getActivities();
                this.setState((prevState) => ({
                    ...prevState,
                    isEdit: false
                }));
            })
            .catch(error => {
                console.error('Error updating activity:', error);
            });
    };

    handleTitleChange(event) {
        this.setState((prevState) => ({
            ...prevState,
            activityTitle: event.target.value,
        }));
    }

    handleTextChange = (event) => {
        this.setState((prevState) => ({
            ...prevState,
            textValue: event.target.value
        }))
    }

    displayTitle = () => {

        if (this.state.isEdit) {
            return (
                <>
                    <input type="text" autoFocus className="border-0 border-b-2 border-slate-300 focus:border-slate-500 focus:border-0 focus:border-b-2 focus:ring-0 text-3xl px-0 py-2 bg-transparent font-bold" defaultValue={this.state.activityTitle} onBlur={() => { this.updateActivity() }} data-cy="todo-title" onChange={(e) => { this.handleTitleChange(e) }} />
                    <button data-cy="todo-title-edit-button" className='ml-6' onClick={() => { this.updateActivity() }}>
                        <img src={iconEdit} alt="icon edit" />
                    </button>
                </>
            )
        } else {
            return (
                <>
                    <div className="text-3xl font-bold py-2 border-b-2 border-transparent" data-cy="todo-title" onClick={() => {
                        this.setState((prevState) => ({
                            ...prevState,
                            isEdit: true,
                        }));
                    }} >
                        {this.state.activityTitle}
                    </div>
                    <button data-cy="todo-title-edit-button" className='ml-6' onClick={() => {
                        this.setState((prevState) => ({
                            ...prevState,
                            isEdit: true,
                        }));
                    }}>
                        <img src={iconEdit} alt="icon edit" />
                    </button>
                </>
            )
        }

    }

    render() {
        const { todos, activityTitle, itemTitle, textValue, isSaving, dataArray, isEdit, isEditItem, editItem, classDropdownPriority, classDropdownSort, todoId, todoTitle, sortOrder, message } = this.state;

        return (
            <>
                <section>
                    <div className="container mx-auto">
                        <div className="mt-12 flex items-center">
                            <Link to='/'>
                                <div className="mr-2">
                                    <img src={iconBack} alt="icon back" />
                                </div>
                            </Link>
                            {this.displayTitle()}
                            <div className="ml-auto">
                                <div className="flex">
                                    <div className="mr-6">
                                        <button onClick={() => this.setState({ classDropdownSort: classDropdownSort === 'hidden' ? 'block' : 'hidden' })} className="h-12 w-12 rounded-full flex items-center justify-center border-slate-200 border-2">
                                            <img src={iconSort} alt="icon sort" />
                                        </button>
                                        <ul className={`py-2 text-gray-700 dark:text-gray-200 z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-[200px] ${classDropdownSort}`}>
                                            <li data-cy="sort-selection" onClick={() => this.handleSortOrderChange('newest')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center cursor-pointer">
                                                {/* <button onClick={() => this.handleSortOrderChange('newest')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center"> */}
                                                <img src={iconSort} alt="icon sort" data-cy="sort-selection-icon" className='mr-4' />
                                                <div data-cy="sort-selection-title">
                                                    Terbaru
                                                </div>

                                                {/* </button> */}
                                            </li>
                                            <li data-cy="sort-selection" onClick={() => this.handleSortOrderChange('oldest')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center cursor-pointer">
                                                {/* <button onClick={() => this.handleSortOrderChange('oldest')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center"> */}
                                                <img src={iconSort} alt="icon sort" data-cy="sort-selection-icon" className='mr-4' />
                                                <div data-cy="sort-selection-title">
                                                    Terlama
                                                </div>

                                                {/* </button> */}
                                            </li>
                                            <li data-cy="sort-selection" onClick={() => this.handleSortOrderChange('asc')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center cursor-pointer">
                                                {/* <button onClick={() => this.handleSortOrderChange('asc')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center"> */}
                                                <img src={iconSort} alt="icon sort" data-cy="sort-selection-icon" className='mr-4' />
                                                <div data-cy="sort-selection-title">
                                                    A-Z
                                                </div>

                                                {/* </button> */}
                                            </li>
                                            <li data-cy="sort-selection" onClick={() => this.handleSortOrderChange('desc')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center cursor-pointer">
                                                {/* <button onClick={() => this.handleSortOrderChange('desc')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center"> */}
                                                <img src={iconSort} alt="icon sort" data-cy="sort-selection-icon" className='mr-4' />
                                                <div data-cy="sort-selection-title">
                                                    Z-A
                                                </div>

                                                {/* </button> */}
                                            </li>
                                            <li data-cy="sort-selection" onClick={() => this.handleSortOrderChange('unchecked')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center cursor-pointer">
                                                {/* <button onClick={() => this.handleSortOrderChange('unchecked')} className="block w-full px-6 py-3 hover:bg-gray-100 flex items-center"> */}
                                                <img src={iconSort} alt="icon sort" data-cy="sort-selection-icon" className='mr-4' />
                                                <div data-cy="sort-selection-title">
                                                    Belum Selesai
                                                </div>

                                                {/* </button> */}
                                            </li>
                                        </ul>
                                    </div>
                                    <button className="inline-flex py-3 px-6 bg-cyan rounded-full text-white font-semibold" onClick={this.handleAddTodo}>
                                        <div>
                                            <img src={IconPlus} alt="icon plus" />
                                        </div>
                                        <div className="ml-2">
                                            Tambah
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 mt-12">
                            {this.displayTodos(todos)}
                        </div>
                    </div>
                </section>

                <div id="addTodoModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full" style={{ zIndex: '999' }}>
                    <div className="relative w-full max-w-2xl max-h-full" data-cy={isEditItem ? 'modal-edit' : 'modal-add'}>
                        <div className="relative bg-white rounded-2xl shadow">
                            <div className="flex items-start justify-between p-6 border-b rounded-t">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white" data-cy={isEditItem ? 'modal-edit-title' : 'modal-add-title'}>
                                    {isEditItem ? 'Edit List Item' : 'Tambah List Item'}
                                </h3>
                                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={this.handleCloseAdd} data-cy={isEditItem ? 'modal-edit-close-button' : 'modal-add-close-button'}>
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="text-sm font-semibold" data-cy={isEditItem ? 'modal-edit-name-title' : 'modal-add-name-title'}>
                                    NAMA LIST ITEM
                                </div>
                                <input type="text" id='addFormTitle' value={textValue} onChange={(e) => this.handleTextChange(e)} className="py-4 px-6 rounded-lg border-2 border-slate-200 w-full mt-2 focus:border-cyan ring-0" placeholder="Tambahkan nama list item" data-cy={isEditItem ? 'modal-edit-name-input' : 'modal-add-name-input'} />
                                <div className="text-sm font-semibold mt-6" data-cy={isEditItem ? 'modal-edit-priority-title' : 'modal-add-priority-title'}>
                                    PRIORITY
                                </div>
                                <button id="priotyDropdownToggle" onClick={classDropdownPriority == 'hidden' ? this.showDropdownPriority : this.hideDropdownPriority} data-cy={isEditItem ? 'modal-edit-priority-dropdown' : 'modal-add-priority-dropdown'} className="py-4 px-6 rounded-lg border-2 border-slate-200 flex items-center mt-2" type="button">
                                    {/* data-dropdown-toggle="priotyDropdown" */}
                                    <div className="mr-4">
                                        <div className={`h-3 w-3 rounded-full ` + (dataArray.color == null ? 'bg-red-500' : dataArray.color)}></div>
                                    </div>
                                    <div>
                                        {dataArray.priority == null ? 'Very High' : dataArray.priority}
                                    </div>
                                    <div className="ml-3">
                                        <img src={iconAngle} alt="icon angle" />
                                    </div>
                                </button>
                                {/* <div id="priotyDropdown" className={`py-2 text-gray-700 dark:text-gray-200 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 z-[70] absolute ` + (classDropdownPriority)}> */}
                                <ul className={`py-2 text-gray-700 dark:text-gray-200 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 z-[70] absolute ` + (classDropdownPriority)} aria-labelledby="priotyDropdownToggle" id="priotyDropdown">
                                    {this.priorities.map((item, index) => (
                                        <li key={index} data-cy={isEditItem ? 'modal-edit-priority-item' : 'modal-add-priority-item'} onClick={() => this.handleItemChange(item)} className="block px-6 py-3 hover:bg-gray-100 w-full flex items-center">
                                            {/* <button onClick={() => handleItemChange(item)} className="block px-6 py-3 hover:bg-gray-100 w-full flex items-center"> */}
                                            <div className="mr-4">
                                                <div className={`h-3 w-3 rounded-full ` + item.color}></div>
                                            </div>
                                            <div>
                                                {item.priority}
                                            </div>

                                            {/* </button> */}
                                        </li>
                                    ))}
                                </ul>
                                {/* </div> */}
                            </div>
                            <div className="p-6 flex border-t">
                                <div className="ml-auto">
                                    <button className="inline-flex py-3 px-6 bg-cyan rounded-full text-white font-semibold disabled:opacity-50" data-cy={isEditItem ? 'modal-edit-save-button' : 'modal-add-save-button'} disabled={!textValue || isSaving} onClick={this.handleSave}>
                                        {isSaving ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="removeTodoModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 hidden w-[500px] p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full mx-auto">
                    <div className="relative w-full max-w-2xl max-h-full" data-cy="modal-delete">
                        <div className="relative bg-white rounded-2xl shadow py-6">
                            <div className="p-6 text-center">
                                <img src={iconAlert} alt="icon alert" className="mx-auto" data-cy="modal-delete-icon" />
                                <div className="mt-6" data-cy="modal-delete-title">
                                    Apakah anda yakin menghapus todo&nbsp;
                                    <span className="font-semibold">
                                        "{todoTitle}"
                                    </span>
                                    ?
                                </div>
                            </div>
                            <div className="p-6 flex justify-center gap-4">
                                <button className="inline-flex py-3 px-6 bg-slate-100 rounded-full text-slate-500 font-semibold" onClick={() => { this.closeDeleteModal() }} data-cy="modal-delete-cancel-button">
                                    Batal
                                </button>
                                <button className="inline-flex py-3 px-6 bg-red-500 rounded-full text-white font-semibold" onClick={() => { this.deleteTodo(this.state.todoId) }} data-cy="modal-delete-confirm-button">
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="successModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 hidden w-[500px] p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full mx-auto">
                    <div className="relative w-full max-w-2xl max-h-full" data-cy="modal-information">
                        <div className="relative bg-white rounded-2xl shadow py-6">
                            <div className="flex items-center px-6">
                                <img src={iconAlertSm} alt="icon alert" data-cy="modal-information-icon" />
                                <div className="ml-4" data-cy="modal-information-title">
                                    {message}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Detail;
