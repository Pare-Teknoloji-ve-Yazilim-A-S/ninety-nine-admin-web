# NestJS Liste Sayfaları - Trae IDE Mimari Kuralları

Bu dosya Trae IDE'de NestJS liste sayfaları geliştirirken takip edilecek mimari kuralları ve best practice'leri içerir.

## 📋 İçindekiler

1. [Genel Mimari Prensipleri](#🏛️-mimari-prensipleri)
2. [Duyuru Modülü Mimarisi](#📢-duyuru-modülü-mimarisi)
3. [Liste Sayfası Mimarisi](#📊-liste-sayfası-mimarisi)
4. [Configuration ve Setup](#🔧-configuration-ve-setup)
5. [Testing Strategy](#🧪-testing-strategy)

## 🏛️ Mimari Prensipleri

### 1. Domain-Driven Design (DDD)
```typescript
// Domain Entity
export class Module {
  constructor(
    public readonly id: ModuleId,
    public name: ModuleName,
    public status: ModuleStatus,
    public createdAt: Date
  ) {}
  
  activate(): void {
    if (this.status === ModuleStatus.ACTIVE) {
      throw new DomainError('Module is already active');
    }
    this.status = ModuleStatus.ACTIVE;
  }
  
  deactivate(): void {
    this.status = ModuleStatus.INACTIVE;
  }
}

// Value Objects
export class ModuleId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ModuleId cannot be empty');
    }
  }
  
  toString(): string {
    return this.value;
  }
}

export class ModuleName {
  constructor(private readonly value: string) {
    if (!value || value.length < 2 || value.length > 100) {
      throw new Error('ModuleName must be between 2 and 100 characters');
    }
  }
  
  toString(): string {
    return this.value;
  }
}
```

### 2. Clean Architecture Layers
```
src/
├── domain/                  # Domain Layer (innermost)
│   ├── entities/
│   ├── value-objects/
│   ├── aggregates/
│   ├── events/
│   └── services/
├── application/             # Application Layer
│   ├── use-cases/
│   ├── commands/
│   ├── queries/
│   ├── handlers/
│   └── services/
├── infrastructure/          # Infrastructure Layer
│   ├── persistence/
│   ├── repositories/
│   ├── external-services/
│   └── messaging/
└── presentation/            # Presentation Layer (outermost)
    ├── controllers/
    ├── dto/
    ├── guards/
    └── interceptors/
```

### 3. CQRS Pattern Implementation
```typescript
// Command for write operations
export class CreateModuleCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly categoryId: string
  ) {}
}

@CommandHandler(CreateModuleCommand)
export class CreateModuleHandler implements ICommandHandler<CreateModuleCommand> {
  constructor(
    private readonly moduleRepository: ModuleRepository,
    private readonly eventBus: EventBus
  ) {}
  
  async execute(command: CreateModuleCommand): Promise<void> {
    const module = new Module(
      ModuleId.generate(),
      new ModuleName(command.name),
      ModuleStatus.DRAFT,
      new Date()
    );
    
    await this.moduleRepository.save(module);
    
    await this.eventBus.publish(
      new ModuleCreatedEvent(module.id.toString(), module.name.toString())
    );
  }
}

// Query for read operations
export class GetModulesListQuery {
  constructor(
    public readonly filters: ModuleFilters,
    public readonly pagination: PaginationParams,
    public readonly sorting: SortingParams
  ) {}
}

@QueryHandler(GetModulesListQuery)
export class GetModulesListHandler implements IQueryHandler<GetModulesListQuery> {
  constructor(private readonly moduleReadRepository: ModuleReadRepository) {}
  
  async execute(query: GetModulesListQuery): Promise<PaginatedResult<ModuleListItem>> {
    return this.moduleReadRepository.findPaginated(
      query.filters,
      query.pagination,
      query.sorting
    );
  }
}
```

### 4. Repository Pattern
```typescript
// Domain Repository Interface
export interface ModuleRepository {
  findById(id: ModuleId): Promise<Module | null>;
  save(module: Module): Promise<void>;
  delete(id: ModuleId): Promise<void>;
}

// Read Repository for Queries
export interface ModuleReadRepository {
  findPaginated(
    filters: ModuleFilters,
    pagination: PaginationParams,
    sorting: SortingParams
  ): Promise<PaginatedResult<ModuleListItem>>;
  
  getStats(): Promise<ModuleStats>;
  getQuickStats(): Promise<QuickStat[]>;
}

// Infrastructure Implementation
@Injectable()
export class TypeOrmModuleRepository implements ModuleRepository, ModuleReadRepository {
  constructor(
    @InjectRepository(ModuleEntity)
    private readonly moduleEntityRepository: Repository<ModuleEntity>
  ) {}
  
  async findById(id: ModuleId): Promise<Module | null> {
    const entity = await this.moduleEntityRepository.findOne({
      where: { id: id.toString() }
    });
    
    return entity ? ModuleMapper.toDomain(entity) : null;
  }
  
  async save(module: Module): Promise<void> {
    const entity = ModuleMapper.toEntity(module);
    await this.moduleEntityRepository.save(entity);
  }
  
  async findPaginated(
    filters: ModuleFilters,
    pagination: PaginationParams,
    sorting: SortingParams
  ): Promise<PaginatedResult<ModuleListItem>> {
    const queryBuilder = this.moduleEntityRepository.createQueryBuilder('module');
    
    // Apply filters
    this.applyFilters(queryBuilder, filters);
    
    // Apply sorting
    this.applySorting(queryBuilder, sorting);
    
    // Apply pagination
    const offset = (pagination.page - 1) * pagination.limit;
    queryBuilder.skip(offset).take(pagination.limit);
    
    const [entities, total] = await queryBuilder.getManyAndCount();
    
    return {
      data: entities.map(ModuleMapper.toListItem),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit)
      }
    };
  }
}
```

### 5. Event-Driven Architecture
```typescript
// Domain Events
export class ModuleCreatedEvent {
  constructor(
    public readonly moduleId: string,
    public readonly moduleName: string,
    public readonly occurredOn: Date = new Date()
  ) {}
}

export class ModuleStatusChangedEvent {
  constructor(
    public readonly moduleId: string,
    public readonly oldStatus: ModuleStatus,
    public readonly newStatus: ModuleStatus,
    public readonly occurredOn: Date = new Date()
  ) {}
}

// Event Handlers
@EventsHandler(ModuleCreatedEvent)
export class ModuleCreatedEventHandler implements IEventHandler<ModuleCreatedEvent> {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly auditService: AuditService
  ) {}
  
  async handle(event: ModuleCreatedEvent): Promise<void> {
    // Send notification
    await this.notificationService.sendModuleCreatedNotification(
      event.moduleId,
      event.moduleName
    );
    
    // Log audit trail
    await this.auditService.logModuleCreation(
      event.moduleId,
      event.occurredOn
    );
  }
}
```

## 📢 Duyuru Modülü Mimarisi

### 1. Domain Model
```typescript
// Domain Entity - Announcement Aggregate Root
export class Announcement {
  constructor(
    public readonly id: AnnouncementId,
    public title: AnnouncementTitle,
    public content: AnnouncementContent,
    public type: AnnouncementType,
    public status: AnnouncementStatus,
    public isPinned: boolean = false,
    public isEmergency: boolean = false,
    public expiryDate?: Date,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
  
  publish(): void {
    if (this.status === AnnouncementStatus.PUBLISHED) {
      throw new DomainError('Announcement is already published');
    }
    if (this.isExpired()) {
      throw new DomainError('Cannot publish expired announcement');
    }
    this.status = AnnouncementStatus.PUBLISHED;
    this.updatedAt = new Date();
    this.addEvent(new AnnouncementPublishedEvent(this.id.toString()));
  }
  
  archive(): void {
    if (this.status === AnnouncementStatus.ARCHIVED) {
      throw new DomainError('Announcement is already archived');
    }
    this.status = AnnouncementStatus.ARCHIVED;
    this.updatedAt = new Date();
    this.addEvent(new AnnouncementArchivedEvent(this.id.toString()));
  }
  
  pin(): void {
    this.isPinned = true;
    this.updatedAt = new Date();
    this.addEvent(new AnnouncementPinnedEvent(this.id.toString()));
  }
  
  unpin(): void {
    this.isPinned = false;
    this.updatedAt = new Date();
  }
  
  markAsEmergency(): void {
    this.isEmergency = true;
    this.updatedAt = new Date();
    this.addEvent(new AnnouncementMarkedEmergencyEvent(this.id.toString()));
  }
  
  isExpired(): boolean {
    return this.expiryDate ? new Date() > this.expiryDate : false;
  }
  
  isExpiringSoon(days: number = 7): boolean {
    if (!this.expiryDate) return false;
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + days);
    return this.expiryDate <= warningDate;
  }
}

// Value Objects
export class AnnouncementId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('AnnouncementId cannot be empty');
    }
  }
  
  toString(): string {
    return this.value;
  }
  
  static generate(): AnnouncementId {
    return new AnnouncementId(crypto.randomUUID());
  }
}

export class AnnouncementTitle {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Announcement title cannot be empty');
    }
    if (value.length > 200) {
      throw new Error('Announcement title cannot exceed 200 characters');
    }
  }
  
  toString(): string {
    return this.value;
  }
}

export class AnnouncementContent {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Announcement content cannot be empty');
    }
    if (value.length > 5000) {
      throw new Error('Announcement content cannot exceed 5000 characters');
    }
  }
  
  toString(): string {
    return this.value;
  }
  
  getPreview(length: number = 100): string {
    return this.value.length > length 
      ? this.value.substring(0, length) + '...' 
      : this.value;
  }
}

// Enums
export enum AnnouncementStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum AnnouncementType {
  GENERAL = 'GENERAL',
  MAINTENANCE = 'MAINTENANCE',
  EMERGENCY = 'EMERGENCY',
  EVENT = 'EVENT',
  RULE = 'RULE',
  MEETING = 'MEETING',
  OTHER = 'OTHER'
}

// Domain Events
export class AnnouncementCreatedEvent {
  constructor(
    public readonly announcementId: string,
    public readonly title: string,
    public readonly type: AnnouncementType,
    public readonly occurredOn: Date = new Date()
  ) {}
}

export class AnnouncementPublishedEvent {
  constructor(
    public readonly announcementId: string,
    public readonly occurredOn: Date = new Date()
  ) {}
}

export class AnnouncementArchivedEvent {
  constructor(
    public readonly announcementId: string,
    public readonly occurredOn: Date = new Date()
  ) {}
}
```

### 2. Application Layer
```typescript
// Commands
export class CreateAnnouncementCommand {
  constructor(
    public readonly title: string,
    public readonly content: string,
    public readonly type: AnnouncementType,
    public readonly isEmergency: boolean = false,
    public readonly expiryDate?: Date,
    public readonly propertyIds?: string[]
  ) {}
}

export class UpdateAnnouncementCommand {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly content?: string,
    public readonly type?: AnnouncementType,
    public readonly isEmergency?: boolean,
    public readonly expiryDate?: Date
  ) {}
}

export class PublishAnnouncementCommand {
  constructor(public readonly id: string) {}
}

// Command Handlers
@CommandHandler(CreateAnnouncementCommand)
export class CreateAnnouncementHandler implements ICommandHandler<CreateAnnouncementCommand> {
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
    private readonly eventBus: EventBus,
    private readonly logger: Logger
  ) {}
  
  async execute(command: CreateAnnouncementCommand): Promise<{ id: string }> {
    try {
      // Validate business rules
      await this.validateAnnouncementCreation(command);
      
      const announcement = new Announcement(
        AnnouncementId.generate(),
        new AnnouncementTitle(command.title),
        new AnnouncementContent(command.content),
        command.type,
        AnnouncementStatus.DRAFT,
        false,
        command.isEmergency,
        command.expiryDate
      );
      
      await this.announcementRepository.save(announcement);
      
      // Publish domain events
      await this.eventBus.publish(
        new AnnouncementCreatedEvent(
          announcement.id.toString(),
          announcement.title.toString(),
          announcement.type
        )
      );
      
      this.logger.log('Announcement created successfully', {
        id: announcement.id.toString(),
        title: announcement.title.toString()
      });
      
      return { id: announcement.id.toString() };
    } catch (error) {
      this.logger.error('Failed to create announcement', error);
      throw error;
    }
  }
  
  private async validateAnnouncementCreation(command: CreateAnnouncementCommand): Promise<void> {
    // Check emergency announcement limits
    if (command.isEmergency) {
      const activeEmergencyCount = await this.announcementRepository.countActiveEmergencyAnnouncements();
      if (activeEmergencyCount >= 3) {
        throw new BusinessRuleViolationException('Maximum 3 emergency announcements allowed');
      }
    }
    
    // Validate expiry date
    if (command.expiryDate && command.expiryDate <= new Date()) {
      throw new BusinessRuleViolationException('Expiry date must be in the future');
    }
  }
}

// Queries
export class GetAnnouncementsListQuery {
  constructor(
    public readonly filters: AnnouncementFilters,
    public readonly pagination: PaginationParams,
    public readonly sorting: SortingParams
  ) {}
}

export class GetAnnouncementByIdQuery {
  constructor(public readonly id: string) {}
}

export class GetAnnouncementStatsQuery {}

// Query Handlers
@QueryHandler(GetAnnouncementsListQuery)
export class GetAnnouncementsListHandler implements IQueryHandler<GetAnnouncementsListQuery> {
  constructor(
    private readonly announcementReadRepository: AnnouncementReadRepository,
    private readonly logger: Logger
  ) {}
  
  async execute(query: GetAnnouncementsListQuery): Promise<PaginatedResult<AnnouncementListItem>> {
    try {
      this.logger.log('Fetching announcements list', {
        filters: query.filters,
        pagination: query.pagination
      });
      
      const result = await this.announcementReadRepository.findPaginated(
        query.filters,
        query.pagination,
        query.sorting
      );
      
      this.logger.log('Announcements list fetched successfully', {
        totalItems: result.pagination.total,
        page: result.pagination.page
      });
      
      return result;
    } catch (error) {
      this.logger.error('Failed to fetch announcements list', error);
      throw new InternalServerErrorException('Failed to fetch announcements list');
    }
  }
}
```

### 3. Infrastructure Layer
```typescript
// TypeORM Entity
@Entity('announcements')
@Index(['title'])
@Index(['status'])
@Index(['type'])
@Index(['createdAt'])
@Index(['expiryDate'])
@Index(['isPinned'])
@Index(['isEmergency'])
export class AnnouncementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ type: 'varchar', length: 200 })
  title: string;
  
  @Column({ type: 'text' })
  content: string;
  
  @Column({ type: 'enum', enum: AnnouncementType })
  type: AnnouncementType;
  
  @Column({ type: 'enum', enum: AnnouncementStatus, default: AnnouncementStatus.DRAFT })
  status: AnnouncementStatus;
  
  @Column({ type: 'boolean', default: false, name: 'is_pinned' })
  isPinned: boolean;
  
  @Column({ type: 'boolean', default: false, name: 'is_emergency' })
  isEmergency: boolean;
  
  @Column({ type: 'timestamp', nullable: true, name: 'expiry_date' })
  expiryDate: Date;
  
  @Column({ type: 'uuid', name: 'created_by' })
  createdBy: string;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
  
  // Relations
  @ManyToOne(() => UserEntity, user => user.announcements)
  @JoinColumn({ name: 'created_by' })
  creator: UserEntity;
  
  @ManyToMany(() => PropertyEntity, property => property.announcements)
  @JoinTable({
    name: 'announcement_properties',
    joinColumn: { name: 'announcement_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'property_id', referencedColumnName: 'id' }
  })
  properties: PropertyEntity[];
}

// Repository Implementation
@Injectable()
export class TypeOrmAnnouncementRepository implements AnnouncementRepository, AnnouncementReadRepository {
  constructor(
    @InjectRepository(AnnouncementEntity)
    private readonly announcementEntityRepository: Repository<AnnouncementEntity>,
    private readonly logger: Logger
  ) {}
  
  async findById(id: AnnouncementId): Promise<Announcement | null> {
    const entity = await this.announcementEntityRepository.findOne({
      where: { id: id.toString() },
      relations: ['creator', 'properties']
    });
    
    return entity ? AnnouncementMapper.toDomain(entity) : null;
  }
  
  async save(announcement: Announcement): Promise<void> {
    const entity = AnnouncementMapper.toEntity(announcement);
    await this.announcementEntityRepository.save(entity);
  }
  
  async delete(id: AnnouncementId): Promise<void> {
    await this.announcementEntityRepository.softDelete(id.toString());
  }
  
  async findPaginated(
    filters: AnnouncementFilters,
    pagination: PaginationParams,
    sorting: SortingParams
  ): Promise<PaginatedResult<AnnouncementListItem>> {
    const queryBuilder = this.announcementEntityRepository
      .createQueryBuilder('announcement')
      .leftJoinAndSelect('announcement.creator', 'creator')
      .leftJoinAndSelect('announcement.properties', 'properties');
    
    // Apply filters
    this.applyFilters(queryBuilder, filters);
    
    // Apply sorting
    this.applySorting(queryBuilder, sorting);
    
    // Apply pagination
    const offset = (pagination.page - 1) * pagination.limit;
    queryBuilder.skip(offset).take(pagination.limit);
    
    const [entities, total] = await queryBuilder.getManyAndCount();
    
    return {
      data: entities.map(AnnouncementMapper.toListItem),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit)
      }
    };
  }
  
  async countActiveEmergencyAnnouncements(): Promise<number> {
    return this.announcementEntityRepository.count({
      where: {
        isEmergency: true,
        status: AnnouncementStatus.PUBLISHED
      }
    });
  }
  
  private applyFilters(queryBuilder: SelectQueryBuilder<AnnouncementEntity>, filters: AnnouncementFilters): void {
    if (filters.search) {
      queryBuilder.andWhere(
        '(announcement.title ILIKE :search OR announcement.content ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }
    
    if (filters.status) {
      queryBuilder.andWhere('announcement.status = :status', { status: filters.status });
    }
    
    if (filters.type) {
      queryBuilder.andWhere('announcement.type = :type', { type: filters.type });
    }
    
    if (filters.isEmergency !== undefined) {
      queryBuilder.andWhere('announcement.isEmergency = :isEmergency', { isEmergency: filters.isEmergency });
    }
    
    if (filters.isPinned !== undefined) {
      queryBuilder.andWhere('announcement.isPinned = :isPinned', { isPinned: filters.isPinned });
    }
    
    if (filters.dateRange) {
      queryBuilder.andWhere('announcement.createdAt BETWEEN :startDate AND :endDate', {
        startDate: filters.dateRange.start,
        endDate: filters.dateRange.end
      });
    }
    
    if (filters.propertyId) {
      queryBuilder.andWhere('properties.id = :propertyId', { propertyId: filters.propertyId });
    }
  }
}
```

### 4. Presentation Layer
```typescript
// Controller
@Controller('announcements')
@ApiTags('Announcements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnnouncementController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}
  
  @Get()
  @ApiOperation({ summary: 'Get paginated announcements list' })
  @ApiResponse({ status: 200, type: PaginatedAnnouncementListResponse })
  @Roles(Role.ADMIN, Role.MANAGER)
  async getAnnouncementsList(
    @Query() queryDto: GetAnnouncementsListQueryDto
  ): Promise<PaginatedAnnouncementListResponse> {
    const query = new GetAnnouncementsListQuery(
      queryDto.toFilters(),
      queryDto.toPagination(),
      queryDto.toSorting()
    );
    
    return this.queryBus.execute(query);
  }
  
  @Get('stats')
  @ApiOperation({ summary: 'Get announcements statistics' })
  @Roles(Role.ADMIN, Role.MANAGER)
  async getAnnouncementsStats(): Promise<AnnouncementStatsResponse> {
    const query = new GetAnnouncementStatsQuery();
    return this.queryBus.execute(query);
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Get announcement by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @Roles(Role.ADMIN, Role.MANAGER)
  async getAnnouncementById(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<AnnouncementDetailResponse> {
    const query = new GetAnnouncementByIdQuery(id);
    return this.queryBus.execute(query);
  }
  
  @Post()
  @ApiOperation({ summary: 'Create new announcement' })
  @ApiResponse({ status: 201, type: CreateAnnouncementResponse })
  @Roles(Role.ADMIN, Role.MANAGER)
  async createAnnouncement(
    @Body() createDto: CreateAnnouncementDto,
    @CurrentUser() user: UserPayload
  ): Promise<CreateAnnouncementResponse> {
    const command = new CreateAnnouncementCommand(
      createDto.title,
      createDto.content,
      createDto.type,
      createDto.isEmergency,
      createDto.expiryDate,
      createDto.propertyIds
    );
    
    const result = await this.commandBus.execute(command);
    return { id: result.id, message: 'Announcement created successfully' };
  }
  
  @Put(':id')
  @ApiOperation({ summary: 'Update announcement' })
  @Roles(Role.ADMIN, Role.MANAGER)
  async updateAnnouncement(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateAnnouncementDto
  ): Promise<UpdateAnnouncementResponse> {
    const command = new UpdateAnnouncementCommand(
      id,
      updateDto.title,
      updateDto.content,
      updateDto.type,
      updateDto.isEmergency,
      updateDto.expiryDate
    );
    
    await this.commandBus.execute(command);
    return { message: 'Announcement updated successfully' };
  }
  
  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish announcement' })
  @Roles(Role.ADMIN, Role.MANAGER)
  async publishAnnouncement(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<PublishAnnouncementResponse> {
    const command = new PublishAnnouncementCommand(id);
    await this.commandBus.execute(command);
    return { message: 'Announcement published successfully' };
  }
  
  @Post(':id/archive')
  @ApiOperation({ summary: 'Archive announcement' })
  @Roles(Role.ADMIN, Role.MANAGER)
  async archiveAnnouncement(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<ArchiveAnnouncementResponse> {
    const command = new ArchiveAnnouncementCommand(id);
    await this.commandBus.execute(command);
    return { message: 'Announcement archived successfully' };
  }
  
  @Delete(':id')
  @ApiOperation({ summary: 'Delete announcement' })
  @Roles(Role.ADMIN)
  async deleteAnnouncement(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<DeleteAnnouncementResponse> {
    const command = new DeleteAnnouncementCommand(id);
    await this.commandBus.execute(command);
    return { message: 'Announcement deleted successfully' };
  }
}
```

### 5. Frontend Integration
```typescript
// Frontend Service Integration (mevcut yapıyı koruyarak)
// src/services/announcement.service.ts

class AnnouncementService extends BaseService<Announcement, CreateAnnouncementDto, UpdateAnnouncementDto> {
  protected baseEndpoint = '/api/announcements';
  
  // Backend API endpoints ile entegrasyon
  async getAllAnnouncements(params?: AnnouncementFilterParams): Promise<PaginatedResponse<Announcement>> {
    const queryParams = this.buildQueryParams(params);
    const response = await apiClient.get<AnnouncementListResponse>(
      `${this.baseEndpoint}${queryParams}`
    );
    return response.data;
  }
  
  async getAnnouncementStats(): Promise<ApiResponse<AnnouncementStats>> {
    const response = await apiClient.get<AnnouncementStats>(`${this.baseEndpoint}/stats`);
    return response;
  }
  
  async publishAnnouncement(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>(`${this.baseEndpoint}/${id}/publish`);
    return response;
  }
  
  async archiveAnnouncement(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>(`${this.baseEndpoint}/${id}/archive`);
    return response;
  }
}

// Frontend Hooks (mevcut yapıyı koruyarak)
// src/app/dashboard/announcements/hooks/useAnnouncementsData.ts

export function useAnnouncementsData({
  currentPage,
  recordsPerPage,
  searchQuery,
  sortConfig,
  filters,
}: UseAnnouncementsDataProps): UseAnnouncementsDataReturn {
  // Mevcut implementation korunur
  // Backend API ile entegrasyon sağlanır
}
```

## 📊 Liste Sayfası Mimarisi

### 1. Genel Mimari Prensipleri

#### Clean Architecture Katmanları
```
Presentation Layer (Controllers, DTOs)
       ↓
Application Layer (Use Cases, Commands, Queries)
       ↓
Domain Layer (Entities, Value Objects, Domain Services)
       ↓
Infrastructure Layer (Repositories, External Services)
```

#### CQRS (Command Query Responsibility Segregation)
```typescript
// Command Side (Write Operations)
interface ICommandHandler<TCommand> {
  execute(command: TCommand): Promise<void | any>;
}

// Query Side (Read Operations)
interface IQueryHandler<TQuery, TResult> {
  execute(query: TQuery): Promise<TResult>;
}
```

#### Repository Pattern
```typescript
// Domain Repository Interface
export interface EntityRepository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}

// Read Repository Interface (for queries)
export interface EntityReadRepository<T> {
  findPaginated(
    filters: EntityFilters,
    pagination: PaginationParams,
    sorting: SortingParams
  ): Promise<PaginatedResult<T>>;
  findByFilters(filters: EntityFilters): Promise<T[]>;
}
```

### 2. Domain Layer

#### Aggregate Root Pattern
```typescript
export abstract class AggregateRoot {
  private _domainEvents: DomainEvent[] = [];
  
  protected addEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }
  
  getEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }
  
  clearEvents(): void {
    this._domainEvents = [];
  }
}

// Example Entity
export class Entity extends AggregateRoot {
  constructor(
    public readonly id: EntityId,
    public name: EntityName,
    public status: EntityStatus,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    super();
  }
  
  activate(): void {
    if (this.status === EntityStatus.ACTIVE) {
      throw new DomainError('Entity is already active');
    }
    this.status = EntityStatus.ACTIVE;
    this.updatedAt = new Date();
    this.addEvent(new EntityActivatedEvent(this.id.toString()));
  }
}
```

#### Value Objects
```typescript
export abstract class ValueObject {
  protected abstract getEqualityComponents(): any[];
  
  equals(other: ValueObject): boolean {
    if (this.constructor !== other.constructor) {
      return false;
    }
    
    const thisComponents = this.getEqualityComponents();
    const otherComponents = other.getEqualityComponents();
    
    return JSON.stringify(thisComponents) === JSON.stringify(otherComponents);
  }
}

export class EntityId extends ValueObject {
  constructor(private readonly value: string) {
    super();
    if (!value || value.trim().length === 0) {
      throw new Error('EntityId cannot be empty');
    }
  }
  
  toString(): string {
    return this.value;
  }
  
  protected getEqualityComponents(): any[] {
    return [this.value];
  }
  
  static generate(): EntityId {
    return new EntityId(crypto.randomUUID());
  }
}
```

#### Domain Events
```typescript
export interface DomainEvent {
  readonly occurredOn: Date;
  readonly eventId: string;
}

export class EntityCreatedEvent implements DomainEvent {
  readonly occurredOn: Date;
  readonly eventId: string;
  
  constructor(
    public readonly entityId: string,
    public readonly entityName: string
  ) {
    this.occurredOn = new Date();
    this.eventId = crypto.randomUUID();
  }
}
```

### 3. Application Layer

#### Command Pattern
```typescript
// Commands
export class CreateEntityCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly categoryId: string
  ) {}
}

export class UpdateEntityCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly description?: string
  ) {}
}

// Command Handlers
@CommandHandler(CreateEntityCommand)
export class CreateEntityHandler implements ICommandHandler<CreateEntityCommand> {
  constructor(
    private readonly entityRepository: EntityRepository,
    private readonly eventBus: EventBus,
    private readonly logger: Logger
  ) {}
  
  async execute(command: CreateEntityCommand): Promise<{ id: string }> {
    try {
      // Business rule validation
      await this.validateEntityCreation(command);
      
      // Create domain entity
      const entity = new Entity(
        EntityId.generate(),
        new EntityName(command.name),
        EntityStatus.DRAFT
      );
      
      // Save to repository
      await this.entityRepository.save(entity);
      
      // Publish domain events
      await this.eventBus.publishAll(entity.getEvents());
      entity.clearEvents();
      
      this.logger.log('Entity created successfully', {
        id: entity.id.toString(),
        name: entity.name.toString()
      });
      
      return { id: entity.id.toString() };
    } catch (error) {
      this.logger.error('Failed to create entity', error);
      throw error;
    }
  }
  
  private async validateEntityCreation(command: CreateEntityCommand): Promise<void> {
    // Business rule validations
    if (command.name.length < 3) {
      throw new BusinessRuleViolationException('Entity name must be at least 3 characters');
    }
  }
}
```

#### Query Pattern
```typescript
// Queries
export class GetEntitiesListQuery {
  constructor(
    public readonly filters: EntityFilters,
    public readonly pagination: PaginationParams,
    public readonly sorting: SortingParams
  ) {}
}

export class GetEntityByIdQuery {
  constructor(public readonly id: string) {}
}

// Query Handlers
@QueryHandler(GetEntitiesListQuery)
export class GetEntitiesListHandler implements IQueryHandler<GetEntitiesListQuery> {
  constructor(
    private readonly entityReadRepository: EntityReadRepository,
    private readonly logger: Logger
  ) {}
  
  async execute(query: GetEntitiesListQuery): Promise<PaginatedResult<EntityListItem>> {
    try {
      this.logger.log('Fetching entities list', {
        filters: query.filters,
        pagination: query.pagination
      });
      
      const result = await this.entityReadRepository.findPaginated(
        query.filters,
        query.pagination,
        query.sorting
      );
      
      this.logger.log('Entities list fetched successfully', {
        totalItems: result.pagination.total,
        page: result.pagination.page
      });
      
      return result;
    } catch (error) {
      this.logger.error('Failed to fetch entities list', error);
      throw new InternalServerErrorException('Failed to fetch entities list');
    }
  }
}
```

### 4. Infrastructure Layer

#### TypeORM Entity
```typescript
@Entity('entities')
@Index(['name'])
@Index(['status'])
@Index(['createdAt'])
export class EntityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ type: 'varchar', length: 100 })
  name: string;
  
  @Column({ type: 'text', nullable: true })
  description: string;
  
  @Column({ type: 'enum', enum: EntityStatus, default: EntityStatus.DRAFT })
  status: EntityStatus;
  
  @Column({ type: 'uuid', name: 'category_id' })
  categoryId: string;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
  
  // Relations
  @ManyToOne(() => CategoryEntity, category => category.entities)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;
}
```

#### Repository Implementation
```typescript
@Injectable()
export class TypeOrmEntityRepository implements EntityRepository, EntityReadRepository {
  constructor(
    @InjectRepository(EntityEntity)
    private readonly entityEntityRepository: Repository<EntityEntity>,
    private readonly logger: Logger
  ) {}
  
  async findById(id: EntityId): Promise<Entity | null> {
    const entity = await this.entityEntityRepository.findOne({
      where: { id: id.toString() },
      relations: ['category']
    });
    
    return entity ? EntityMapper.toDomain(entity) : null;
  }
  
  async save(entity: Entity): Promise<void> {
    const entityEntity = EntityMapper.toEntity(entity);
    await this.entityEntityRepository.save(entityEntity);
  }
  
  async delete(id: EntityId): Promise<void> {
    await this.entityEntityRepository.softDelete(id.toString());
  }
  
  async findPaginated(
    filters: EntityFilters,
    pagination: PaginationParams,
    sorting: SortingParams
  ): Promise<PaginatedResult<EntityListItem>> {
    const queryBuilder = this.entityEntityRepository
      .createQueryBuilder('entity')
      .leftJoinAndSelect('entity.category', 'category');
    
    // Apply filters
    this.applyFilters(queryBuilder, filters);
    
    // Apply sorting
    this.applySorting(queryBuilder, sorting);
    
    // Apply pagination
    const offset = (pagination.page - 1) * pagination.limit;
    queryBuilder.skip(offset).take(pagination.limit);
    
    const [entities, total] = await queryBuilder.getManyAndCount();
    
    return {
      data: entities.map(EntityMapper.toListItem),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit)
      }
    };
  }
  
  private applyFilters(queryBuilder: SelectQueryBuilder<EntityEntity>, filters: EntityFilters): void {
    if (filters.search) {
      queryBuilder.andWhere(
        '(entity.name ILIKE :search OR entity.description ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }
    
    if (filters.status) {
      queryBuilder.andWhere('entity.status = :status', { status: filters.status });
    }
    
    if (filters.categoryId) {
      queryBuilder.andWhere('entity.categoryId = :categoryId', { categoryId: filters.categoryId });
    }
    
    if (filters.dateRange) {
      queryBuilder.andWhere('entity.createdAt BETWEEN :startDate AND :endDate', {
        startDate: filters.dateRange.start,
        endDate: filters.dateRange.end
      });
    }
  }
  
  private applySorting(queryBuilder: SelectQueryBuilder<EntityEntity>, sorting: SortingParams): void {
    const { field, direction } = sorting;
    const allowedFields = ['name', 'status', 'createdAt', 'updatedAt'];
    
    if (allowedFields.includes(field)) {
      queryBuilder.orderBy(`entity.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('entity.createdAt', 'DESC');
    }
  }
}
```

### 5. Presentation Layer

#### Controller
```typescript
@Controller('entities')
@ApiTags('Entities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EntityController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}
  
  @Get()
  @ApiOperation({ summary: 'Get paginated entities list' })
  @ApiResponse({ status: 200, type: PaginatedEntityListResponse })
  @Roles(Role.ADMIN, Role.USER)
  async getEntitiesList(
    @Query() queryDto: GetEntitiesListQueryDto
  ): Promise<PaginatedEntityListResponse> {
    const query = new GetEntitiesListQuery(
      queryDto.toFilters(),
      queryDto.toPagination(),
      queryDto.toSorting()
    );
    
    return this.queryBus.execute(query);
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Get entity by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @Roles(Role.ADMIN, Role.USER)
  async getEntityById(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<EntityDetailResponse> {
    const query = new GetEntityByIdQuery(id);
    return this.queryBus.execute(query);
  }
  
  @Post()
  @ApiOperation({ summary: 'Create new entity' })
  @ApiResponse({ status: 201, type: CreateEntityResponse })
  @Roles(Role.ADMIN)
  async createEntity(
    @Body() createDto: CreateEntityDto
  ): Promise<CreateEntityResponse> {
    const command = new CreateEntityCommand(
      createDto.name,
      createDto.description,
      createDto.categoryId
    );
    
    const result = await this.commandBus.execute(command);
    return { id: result.id, message: 'Entity created successfully' };
  }
  
  @Put(':id')
  @ApiOperation({ summary: 'Update entity' })
  @Roles(Role.ADMIN)
  async updateEntity(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateEntityDto
  ): Promise<UpdateEntityResponse> {
    const command = new UpdateEntityCommand(
      id,
      updateDto.name,
      updateDto.description
    );
    
    await this.commandBus.execute(command);
    return { message: 'Entity updated successfully' };
  }
  
  @Delete(':id')
  @ApiOperation({ summary: 'Delete entity' })
  @Roles(Role.ADMIN)
  async deleteEntity(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<DeleteEntityResponse> {
    const command = new DeleteEntityCommand(id);
    await this.commandBus.execute(command);
    return { message: 'Entity deleted successfully' };
  }
}
```

#### DTOs
```typescript
// Query DTOs
export class GetEntitiesListQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
  
  @ApiPropertyOptional({ enum: EntityStatus })
  @IsOptional()
  @IsEnum(EntityStatus)
  status?: EntityStatus;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;
  
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;
  
  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
  
  @ApiPropertyOptional({ default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';
  
  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
  
  toFilters(): EntityFilters {
    return {
      search: this.search,
      status: this.status,
      categoryId: this.categoryId
    };
  }
  
  toPagination(): PaginationParams {
    return {
      page: this.page || 1,
      limit: this.limit || 20
    };
  }
  
  toSorting(): SortingParams {
    return {
      field: this.sortBy || 'createdAt',
      direction: this.sortOrder || 'desc'
    };
  }
}

// Command DTOs
export class CreateEntityDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
  
  @ApiProperty()
  @IsUUID()
  categoryId: string;
}

export class UpdateEntityDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
```

### 6. Event-Driven Architecture

#### Event Handlers
```typescript
@EventsHandler(EntityCreatedEvent)
export class EntityCreatedEventHandler implements IEventHandler<EntityCreatedEvent> {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly auditService: AuditService,
    private readonly logger: Logger
  ) {}
  
  async handle(event: EntityCreatedEvent): Promise<void> {
    try {
      // Send notification
      await this.notificationService.sendEntityCreatedNotification({
        entityId: event.entityId,
        entityName: event.entityName
      });
      
      // Log audit trail
      await this.auditService.logEntityCreation({
        entityId: event.entityId,
        entityName: event.entityName,
        timestamp: event.occurredOn
      });
      
      this.logger.log('Entity created event processed', {
        entityId: event.entityId,
        eventId: event.eventId
      });
    } catch (error) {
      this.logger.error('Failed to process entity created event', error);
      // Don't throw - event processing should not fail the main operation
    }
  }
}
```

### 7. Module Configuration

#### Entity Module
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([EntityEntity]),
    CqrsModule
  ],
  controllers: [EntityController],
  providers: [
    // Command Handlers
    CreateEntityHandler,
    UpdateEntityHandler,
    DeleteEntityHandler,
    
    // Query Handlers
    GetEntitiesListHandler,
    GetEntityByIdHandler,
    
    // Event Handlers
    EntityCreatedEventHandler,
    EntityUpdatedEventHandler,
    
    // Repositories
    {
      provide: 'EntityRepository',
      useClass: TypeOrmEntityRepository
    },
    {
      provide: 'EntityReadRepository',
      useClass: TypeOrmEntityRepository
    },
    
    // Services
    EntityService,
    EntityValidationService
  ],
  exports: [
    'EntityRepository',
    'EntityReadRepository',
    EntityService
  ]
})
export class EntityModule {}
```

### 8. Database Migration

```sql
-- Create entities table
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  category_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_entities_name ON entities(name);
CREATE INDEX idx_entities_status ON entities(status);
CREATE INDEX idx_entities_category_id ON entities(category_id);
CREATE INDEX idx_entities_created_at ON entities(created_at);
CREATE INDEX idx_entities_deleted_at ON entities(deleted_at);

-- Add foreign key constraint
ALTER TABLE entities 
ADD CONSTRAINT fk_entities_category_id 
FOREIGN KEY (category_id) REFERENCES categories(id);
```

### 9. Testing Strategy

#### Unit Tests
```typescript
describe('CreateEntityHandler', () => {
  let handler: CreateEntityHandler;
  let mockRepository: jest.Mocked<EntityRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockLogger: jest.Mocked<Logger>;
  
  beforeEach(() => {
    mockRepository = createMockRepository();
    mockEventBus = createMockEventBus();
    mockLogger = createMockLogger();
    
    handler = new CreateEntityHandler(
      mockRepository,
      mockEventBus,
      mockLogger
    );
  });
  
  describe('execute', () => {
    it('should create entity successfully', async () => {
      // Arrange
      const command = new CreateEntityCommand(
        'Test Entity',
        'Test Description',
        'category-id'
      );
      
      mockRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);
      
      // Act
      const result = await handler.execute(command);
      
      // Assert
      expect(result.id).toBeDefined();
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      expect(mockLogger.log).toHaveBeenCalledWith(
        'Entity created successfully',
        expect.any(Object)
      );
    });
    
    it('should throw error when entity name is too short', async () => {
      // Arrange
      const command = new CreateEntityCommand(
        'Te', // Too short
        'Test Description',
        'category-id'
      );
      
      // Act & Assert
      await expect(handler.execute(command))
        .rejects
        .toThrow(BusinessRuleViolationException);
    });
  });
});
```

### 10. En İyi Uygulamalar

#### Domain Layer
- ✅ Rich domain models kullanın
- ✅ Business logic'i domain entities içinde tutun
- ✅ Value objects ile primitive obsession'dan kaçının
- ✅ Domain events ile loose coupling sağlayın
- ❌ Domain layer'da infrastructure bağımlılıkları kullanmayın

#### Application Layer
- ✅ Thin application services yazın
- ✅ Command/Query separation uygulayın
- ✅ Transaction boundaries'i command handler'larda yönetin
- ✅ Input validation yapın
- ❌ Business logic'i application layer'a koymayın

#### Infrastructure Layer
- ✅ Repository pattern uygulayın
- ✅ Database-specific logic'i burada tutun
- ✅ External service integrations burada yapın
- ✅ Proper error handling ve logging yapın

#### Presentation Layer
- ✅ Thin controllers yazın
- ✅ Proper HTTP status codes kullanın
- ✅ Input validation ve sanitization yapın
- ✅ API documentation sağlayın
- ❌ Business logic'i controller'larda yazmayın

### 11. Frontend Entegrasyon

#### Service Layer Integration
```typescript
// Base Service Class
export abstract class BaseService<TEntity, TCreateDto, TUpdateDto> {
  protected abstract baseEndpoint: string;
  
  protected buildQueryParams(params?: Record<string, any>): string {
    if (!params) return '';
    
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    
    return searchParams.toString() ? `?${searchParams.toString()}` : '';
  }
  
  async getList(params?: ListParams): Promise<PaginatedResponse<TEntity>> {
    const queryParams = this.buildQueryParams(params);
    const response = await apiClient.get<PaginatedResponse<TEntity>>(
      `${this.baseEndpoint}${queryParams}`
    );
    return response.data;
  }
  
  async getById(id: string): Promise<ApiResponse<TEntity>> {
    const response = await apiClient.get<TEntity>(`${this.baseEndpoint}/${id}`);
    return response;
  }
  
  async create(data: TCreateDto): Promise<ApiResponse<{ id: string }>> {
    const response = await apiClient.post<{ id: string }>(
      this.baseEndpoint,
      data
    );
    return response;
  }
  
  async update(id: string, data: TUpdateDto): Promise<ApiResponse<void>> {
    const response = await apiClient.put<void>(
      `${this.baseEndpoint}/${id}`,
      data
    );
    return response;
  }
  
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<void>(`${this.baseEndpoint}/${id}`);
    return response;
  }
}
```

#### Custom Hooks Pattern
```typescript
// Data Hook
export function useEntityData({
  currentPage,
  recordsPerPage,
  searchQuery,
  sortConfig,
  filters,
}: UseEntityDataProps): UseEntityDataReturn {
  const [data, setData] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: recordsPerPage,
        search: searchQuery,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
        ...filters
      };
      
      const response = await entityService.getList(params);
      
      if (response.success) {
        setData(response.data.data);
        setTotalRecords(response.data.pagination.total);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError(response.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError('An error occurred while fetching data');
      console.error('Error fetching entities:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, recordsPerPage, searchQuery, sortConfig, filters]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);
  
  return {
    data,
    loading,
    error,
    totalRecords,
    totalPages,
    refreshData
  };
}

// Actions Hook
export function useEntityActions() {
  const { showToast } = useToast();
  
  const handleCreate = useCallback(async (data: CreateEntityDto) => {
    try {
      const response = await entityService.create(data);
      
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Entity created successfully'
        });
        return response.data;
      } else {
        showToast({
          type: 'error',
          message: response.message || 'Failed to create entity'
        });
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error creating entity:', error);
      throw error;
    }
  }, [showToast]);
  
  const handleUpdate = useCallback(async (id: string, data: UpdateEntityDto) => {
    try {
      const response = await entityService.update(id, data);
      
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Entity updated successfully'
        });
      } else {
        showToast({
          type: 'error',
          message: response.message || 'Failed to update entity'
        });
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error updating entity:', error);
      throw error;
    }
  }, [showToast]);
  
  const handleDelete = useCallback(async (id: string) => {
    try {
      const response = await entityService.delete(id);
      
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Entity deleted successfully'
        });
      } else {
        showToast({
          type: 'error',
          message: response.message || 'Failed to delete entity'
        });
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error deleting entity:', error);
      throw error;
    }
  }, [showToast]);
  
  return {
    handleCreate,
    handleUpdate,
    handleDelete
  };
}
```

#### Component Structure
```typescript
// Main List Page Component
export function EntityListPage() {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Custom hooks
  const {
    data,
    loading,
    error,
    totalRecords,
    totalPages,
    refreshData
  } = useEntityData({
    currentPage,
    recordsPerPage,
    searchQuery,
    sortConfig,
    filters
  });
  
  const { handleCreate, handleUpdate, handleDelete } = useEntityActions();
  
  // Event handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);
  
  const handleSort = useCallback((key: string, direction: 'asc' | 'desc') => {
    setSortConfig({ key, direction });
    setCurrentPage(1);
  }, []);
  
  const handleFilter = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);
  
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  const handleRecordsPerPageChange = useCallback((records: number) => {
    setRecordsPerPage(records);
    setCurrentPage(1);
  }, []);
  
  // Render
  return (
    <div className="entity-list-page">
      <PageHeader
        title="Entities"
        breadcrumbs={BREADCRUMB_ITEMS}
        actions={
          <CreateEntityButton
            onCreate={handleCreate}
            onSuccess={refreshData}
          />
        }
      />
      
      <div className="page-content">
        <div className="filters-section">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search entities..."
          />
          
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFilter}
            filterGroups={ENTITY_FILTER_GROUPS}
          />
          
          <ViewToggle
            value={viewMode}
            onChange={setViewMode}
            options={VIEW_OPTIONS}
          />
        </div>
        
        <div className="data-section">
          {viewMode === 'list' ? (
            <GenericListView
              data={data}
              columns={ENTITY_TABLE_COLUMNS}
              loading={loading}
              error={error}
              sortConfig={sortConfig}
              onSort={handleSort}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onRefresh={refreshData}
            />
          ) : (
            <GenericGridView
              data={data}
              loading={loading}
              error={error}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onRefresh={refreshData}
            />
          )}
        </div>
        
        <div className="pagination-section">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            recordsPerPage={recordsPerPage}
            onPageChange={handlePageChange}
            onRecordsPerPageChange={handleRecordsPerPageChange}
          />
        </div>
      </div>
    </div>
  );
}
```

### 12. Geliştirme İş Akışı

#### 1. Yeni Liste Sayfası Oluşturma Adımları

```bash
# 1. Backend Development
# Domain Layer
mkdir -p src/modules/entity/domain
touch src/modules/entity/domain/entity.aggregate.ts
touch src/modules/entity/domain/entity-id.value-object.ts
touch src/modules/entity/domain/entity.repository.ts
touch src/modules/entity/domain/entity.events.ts

# Application Layer
mkdir -p src/modules/entity/application/commands
mkdir -p src/modules/entity/application/queries
touch src/modules/entity/application/commands/create-entity.command.ts
touch src/modules/entity/application/commands/create-entity.handler.ts
touch src/modules/entity/application/queries/get-entities-list.query.ts
touch src/modules/entity/application/queries/get-entities-list.handler.ts

# Infrastructure Layer
mkdir -p src/modules/entity/infrastructure
touch src/modules/entity/infrastructure/entity.entity.ts
touch src/modules/entity/infrastructure/entity.repository.ts
touch src/modules/entity/infrastructure/entity.mapper.ts

# Presentation Layer
mkdir -p src/modules/entity/presentation
touch src/modules/entity/presentation/entity.controller.ts
touch src/modules/entity/presentation/dtos/create-entity.dto.ts
touch src/modules/entity/presentation/dtos/get-entities-list.dto.ts

# Module Configuration
touch src/modules/entity/entity.module.ts

# 2. Frontend Development
mkdir -p src/app/dashboard/entities
touch src/app/dashboard/entities/page.tsx
touch src/app/dashboard/entities/constants/index.ts
touch src/app/dashboard/entities/hooks/useEntitiesData.ts
touch src/app/dashboard/entities/hooks/useEntitiesActions.ts
touch src/app/dashboard/entities/components/table-columns.tsx
touch src/app/dashboard/entities/components/entity-actions.tsx

# Services
touch src/services/entity.service.ts

# Types
touch src/types/entity.types.ts
```

#### 2. Development Checklist

**Backend Checklist:**
- [ ] Domain entities ve value objects oluşturuldu
- [ ] Repository interfaces tanımlandı
- [ ] Command/Query handlers yazıldı
- [ ] TypeORM entities oluşturuldu
- [ ] Repository implementations yazıldı
- [ ] Controllers ve DTOs oluşturuldu
- [ ] Module configuration yapıldı
- [ ] Database migration yazıldı
- [ ] Unit testler yazıldı
- [ ] Integration testler yazıldı
- [ ] API documentation eklendi

**Frontend Checklist:**
- [ ] Service class oluşturuldu
- [ ] Custom hooks yazıldı
- [ ] Page component oluşturuldu
- [ ] Table columns tanımlandı
- [ ] Action handlers yazıldı
- [ ] Constants dosyası oluşturuldu
- [ ] Types tanımlandı
- [ ] Error handling eklendi
- [ ] Loading states eklendi
- [ ] Responsive design uygulandı

#### 3. Code Generation Templates

```typescript
// Domain Entity Template
export class {{EntityName}} extends AggregateRoot {
  constructor(
    public readonly id: {{EntityName}}Id,
    public name: {{EntityName}}Name,
    public status: {{EntityName}}Status,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    super();
  }
  
  // Business methods
  activate(): void {
    if (this.status === {{EntityName}}Status.ACTIVE) {
      throw new DomainError('{{EntityName}} is already active');
    }
    this.status = {{EntityName}}Status.ACTIVE;
    this.updatedAt = new Date();
    this.addEvent(new {{EntityName}}ActivatedEvent(this.id.toString()));
  }
}

// Command Handler Template
@CommandHandler(Create{{EntityName}}Command)
export class Create{{EntityName}}Handler implements ICommandHandler<Create{{EntityName}}Command> {
  constructor(
    private readonly {{entityName}}Repository: {{EntityName}}Repository,
    private readonly eventBus: EventBus,
    private readonly logger: Logger
  ) {}
  
  async execute(command: Create{{EntityName}}Command): Promise<{ id: string }> {
    // Implementation
  }
}

// Frontend Service Template
class {{EntityName}}Service extends BaseService<{{EntityName}}, Create{{EntityName}}Dto, Update{{EntityName}}Dto> {
  protected baseEndpoint = '/api/{{entityNameKebab}}';
  
  // Custom methods
}

// Frontend Hook Template
export function use{{EntityName}}Data({
  currentPage,
  recordsPerPage,
  searchQuery,
  sortConfig,
  filters,
}: Use{{EntityName}}DataProps): Use{{EntityName}}DataReturn {
  // Implementation
}
```

#### 4. Testing Strategy

```typescript
// Backend Unit Test Template
describe('Create{{EntityName}}Handler', () => {
  let handler: Create{{EntityName}}Handler;
  let mockRepository: jest.Mocked<{{EntityName}}Repository>;
  
  beforeEach(() => {
    // Setup
  });
  
  it('should create {{entityName}} successfully', async () => {
    // Test implementation
  });
});

// Frontend Component Test Template
describe('{{EntityName}}ListPage', () => {
  it('should render {{entityName}} list', () => {
    // Test implementation
  });
  
  it('should handle search', () => {
    // Test implementation
  });
});
```

#### 5. Performance Optimization

**Backend Optimizations:**
- Database indexing strategy
- Query optimization
- Caching implementation
- Pagination optimization

**Frontend Optimizations:**
- React.memo for components
- useMemo for expensive calculations
- useCallback for event handlers
- Virtual scrolling for large lists
- Debounced search

```typescript
// Optimized Search Hook
export function useDebouncedSearch(initialValue: string, delay: number = 300) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, delay]);
  
  return [debouncedSearchTerm, setSearchTerm] as const;
}
```

## En İyi Uygulamalar ve Öneriler

### 1. Kod Kalitesi
- **Tip Güvenliği**: TypeScript'i tam olarak kullanın
- **Hata Yönetimi**: Kapsamlı error handling uygulayın
- **Validasyon**: Hem frontend hem backend'de validasyon yapın
- **Logging**: Structured logging kullanın
- **Monitoring**: APM ve metrics toplama

### 2. Güvenlik
- **Authentication**: JWT token'ları güvenli şekilde saklayın
- **Authorization**: Role-based access control uygulayın
- **Input Validation**: Tüm kullanıcı girdilerini validate edin
- **SQL Injection**: Parameterized queries kullanın
- **XSS Protection**: Output encoding uygulayın

### 3. Performans
- **Database**: Uygun indexleme stratejisi
- **Caching**: Redis ile caching katmanı
- **Pagination**: Efficient pagination
- **Lazy Loading**: Frontend'de lazy loading
- **Bundle Optimization**: Code splitting

### 4. Maintainability
- **Clean Code**: SOLID prensipleri
- **Documentation**: Kapsamlı dokümantasyon
- **Testing**: Yüksek test coverage
- **Code Review**: Peer review süreci
- **Refactoring**: Düzenli refactoring

### 5. Scalability
- **Microservices**: Modüler mimari
- **Event-Driven**: Asenkron işlemler
- **Load Balancing**: Horizontal scaling
- **Database Sharding**: Veri dağıtımı
- **CDN**: Static asset'ler için CDN

## Sonuç

Bu mimari rehber, modern web uygulamaları için kapsamlı bir yaklaşım sunmaktadır. Domain-Driven Design, Clean Architecture, CQRS ve Event-Driven Architecture prensiplerini birleştirerek, ölçeklenebilir, sürdürülebilir ve test edilebilir uygulamalar geliştirmenizi sağlar.

### Önemli Noktalar:
1. **Katmanlı Mimari**: Her katmanın sorumluluğu net olarak ayrılmıştır
2. **Dependency Inversion**: Bağımlılıklar içe doğru akar
3. **Event-Driven**: Loosely coupled sistemler
4. **Test-Driven**: Kapsamlı test stratejisi
5. **Performance**: Optimizasyon odaklı yaklaşım

Bu rehberi takip ederek, enterprise seviyede uygulamalar geliştirebilir ve uzun vadede sürdürülebilir kod tabanları oluşturabilirsiniz.

---

*Bu dokümantasyon, sürekli güncellenmekte olan bir rehberdir. Yeni teknolojiler ve best practice'ler doğrultusunda düzenli olarak revize edilmektedir.*
@Controller('modules')
@ApiTags('Modules')
export class ModuleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}
  
  @Get()
  @ApiOperation({ summary: 'Get paginated modules list' })
  @ApiResponse({ status: 200, type: PaginatedModuleListResponse })
  async getModulesList(
    @Query() queryDto: GetModulesListQueryDto
  ): Promise<PaginatedModuleListResponse> {
    const query = new GetModulesListQuery(
      queryDto.toFilters(),
      queryDto.toPagination(),
      queryDto.toSorting()
    );
    
    return this.queryBus.execute(query);
  }
  
  @Get('stats')
  @ApiOperation({ summary: 'Get modules statistics' })
  async getModulesStats(): Promise<ModuleStatsResponse> {
    const query = new GetModulesStatsQuery();
    return this.queryBus.execute(query);
  }
  
  @Post()
  @ApiOperation({ summary: 'Create new module' })
  async createModule(
    @Body() createDto: CreateModuleDto
  ): Promise<CreateModuleResponse> {
    const command = new CreateModuleCommand(
      createDto.name,
      createDto.description,
      createDto.categoryId
    );
    
    const result = await this.commandBus.execute(command);
    return { id: result.id, message: 'Module created successfully' };
  }
}
```

### 2. DTO Layer with Validation
```typescript
// Query DTO
export class GetModulesListQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: 'Page number', minimum: 1, default: 1 })
  page?: number = 1;
  
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 100, default: 20 })
  limit?: number = 20;
  
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @ApiPropertyOptional({ description: 'Search term', minLength: 2, maxLength: 100 })
  search?: string;
  
  @IsOptional()
  @IsEnum(ModuleStatus)
  @ApiPropertyOptional({ enum: ModuleStatus, description: 'Filter by status' })
  status?: ModuleStatus;
  
  @IsOptional()
  @IsString()
  @IsIn(['name', 'createdAt', 'updatedAt', 'status'])
  @ApiPropertyOptional({ description: 'Sort field', enum: ['name', 'createdAt', 'updatedAt', 'status'] })
  sortBy?: string = 'createdAt';
  
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], description: 'Sort direction' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
  
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ description: 'Filter from date' })
  startDate?: string;
  
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ description: 'Filter to date' })
  endDate?: string;
  
  toFilters(): ModuleFilters {
    return {
      search: this.search,
      status: this.status,
      dateRange: this.startDate && this.endDate ? {
        start: new Date(this.startDate),
        end: new Date(this.endDate)
      } : undefined
    };
  }
  
  toPagination(): PaginationParams {
    return {
      page: this.page || 1,
      limit: this.limit || 20
    };
  }
  
  toSorting(): SortingParams {
    return {
      field: this.sortBy || 'createdAt',
      direction: this.sortOrder || 'DESC'
    };
  }
}

// Response DTO
export class PaginatedModuleListResponse {
  @ApiProperty({ type: [ModuleListItemDto] })
  data: ModuleListItemDto[];
  
  @ApiProperty({ type: PaginationMetaDto })
  pagination: PaginationMetaDto;
  
  @ApiProperty({ type: ModuleStatsDto })
  stats?: ModuleStatsDto;
}

export class ModuleListItemDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  name: string;
  
  @ApiProperty({ enum: ModuleStatus })
  status: ModuleStatus;
  
  @ApiProperty()
  createdAt: Date;
  
  @ApiProperty()
  updatedAt: Date;
  
  @ApiProperty({ required: false })
  description?: string;
  
  @ApiProperty({ required: false })
  categoryName?: string;
}
```

### 3. Service Layer with Business Logic
```typescript
@Injectable()
export class ModuleApplicationService {
  constructor(
    private readonly moduleRepository: ModuleRepository,
    private readonly moduleReadRepository: ModuleReadRepository,
    private readonly eventBus: EventBus,
    private readonly logger: Logger
  ) {}
  
  async getModulesList(
    filters: ModuleFilters,
    pagination: PaginationParams,
    sorting: SortingParams
  ): Promise<PaginatedResult<ModuleListItem>> {
    try {
      this.logger.log('Fetching modules list', {
        filters,
        pagination,
        sorting
      });
      
      const result = await this.moduleReadRepository.findPaginated(
        filters,
        pagination,
        sorting
      );
      
      this.logger.log('Modules list fetched successfully', {
        totalItems: result.pagination.total,
        page: result.pagination.page
      });
      
      return result;
    } catch (error) {
      this.logger.error('Failed to fetch modules list', error);
      throw new InternalServerErrorException('Failed to fetch modules list');
    }
  }
  
  async createModule(
    name: string,
    description: string,
    categoryId: string
  ): Promise<{ id: string }> {
    try {
      // Validate business rules
      await this.validateModuleCreation(name, categoryId);
      
      const module = new Module(
        ModuleId.generate(),
        new ModuleName(name),
        ModuleStatus.DRAFT,
        new Date()
      );
      
      await this.moduleRepository.save(module);
      
      // Publish domain event
      await this.eventBus.publish(
        new ModuleCreatedEvent(module.id.toString(), module.name.toString())
      );
      
      this.logger.log('Module created successfully', {
        moduleId: module.id.toString(),
        moduleName: module.name.toString()
      });
      
      return { id: module.id.toString() };
    } catch (error) {
      this.logger.error('Failed to create module', error);
      throw error;
    }
  }
  
  private async validateModuleCreation(name: string, categoryId: string): Promise<void> {
    // Check if module name already exists
    const existingModule = await this.moduleReadRepository.findByName(name);
    if (existingModule) {
      throw new ConflictException('Module with this name already exists');
    }
    
    // Validate category exists
    const categoryExists = await this.categoryService.exists(categoryId);
    if (!categoryExists) {
      throw new BadRequestException('Invalid category ID');
    }
  }
}
```

## 🔧 Configuration ve Setup

### 1. Module Configuration
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([ModuleEntity]),
    CqrsModule,
    EventEmitterModule.forRoot()
  ],
  controllers: [ModuleController],
  providers: [
    ModuleApplicationService,
    
    // Command Handlers
    CreateModuleHandler,
    UpdateModuleHandler,
    DeleteModuleHandler,
    
    // Query Handlers
    GetModulesListHandler,
    GetModuleByIdHandler,
    GetModulesStatsHandler,
    
    // Event Handlers
    ModuleCreatedEventHandler,
    ModuleStatusChangedEventHandler,
    
    // Repositories
    {
      provide: 'ModuleRepository',
      useClass: TypeOrmModuleRepository
    },
    {
      provide: 'ModuleReadRepository',
      useClass: TypeOrmModuleRepository
    },
    
    // Services
    ModuleDomainService,
    ModuleValidationService
  ],
  exports: [ModuleApplicationService]
})
export class ModuleModule {}
```

### 2. Database Configuration
```typescript
// Entity
@Entity('modules')
@Index(['name'], { unique: true })
@Index(['status'])
@Index(['createdAt'])
@Index(['categoryId'])
export class ModuleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;
  
  @Column({ type: 'text', nullable: true })
  description: string;
  
  @Column({ type: 'enum', enum: ModuleStatus, default: ModuleStatus.DRAFT })
  status: ModuleStatus;
  
  @Column({ type: 'uuid', name: 'category_id' })
  categoryId: string;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
  
  // Relations
  @ManyToOne(() => CategoryEntity, category => category.modules)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;
}

// Migration
export class CreateModulesTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'modules',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isUnique: true
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['DRAFT', 'ACTIVE', 'INACTIVE'],
            default: "'DRAFT'"
          },
          {
            name: 'category_id',
            type: 'uuid'
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true
          }
        ],
        indices: [
          {
            name: 'IDX_modules_name',
            columnNames: ['name'],
            isUnique: true
          },
          {
            name: 'IDX_modules_status',
            columnNames: ['status']
          },
          {
            name: 'IDX_modules_created_at',
            columnNames: ['created_at']
          },
          {
            name: 'IDX_modules_category_id',
            columnNames: ['category_id']
          }
        ],
        foreignKeys: [
          {
            columnNames: ['category_id'],
            referencedTableName: 'categories',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE'
          }
        ]
      }),
      true
    );
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('modules');
  }
}
```

## 🧪 Testing Strategy

### 1. Unit Tests
```typescript
// Domain Tests
describe('Module Domain', () => {
  describe('Module Entity', () => {
    it('should create a valid module', () => {
      const module = new Module(
        new ModuleId('test-id'),
        new ModuleName('Test Module'),
        ModuleStatus.DRAFT,
        new Date()
      );
      
      expect(module.id.toString()).toBe('test-id');
      expect(module.name.toString()).toBe('Test Module');
      expect(module.status).toBe(ModuleStatus.DRAFT);
    });
    
    it('should activate module', () => {
      const module = new Module(
        new ModuleId('test-id'),
        new ModuleName('Test Module'),
        ModuleStatus.DRAFT,
        new Date()
      );
      
      module.activate();
      
      expect(module.status).toBe(ModuleStatus.ACTIVE);
    });
    
    it('should throw error when activating already active module', () => {
      const module = new Module(
        new ModuleId('test-id'),
        new ModuleName('Test Module'),
        ModuleStatus.ACTIVE,
        new Date()
      );
      
      expect(() => module.activate()).toThrow('Module is already active');
    });
  });
});

// Application Tests
describe('ModuleApplicationService', () => {
  let service: ModuleApplicationService;
  let moduleRepository: jest.Mocked<ModuleRepository>;
  let moduleReadRepository: jest.Mocked<ModuleReadRepository>;
  let eventBus: jest.Mocked<EventBus>;
  
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ModuleApplicationService,
        {
          provide: 'ModuleRepository',
          useValue: {
            save: jest.fn(),
            findById: jest.fn(),
            delete: jest.fn()
          }
        },
        {
          provide: 'ModuleReadRepository',
          useValue: {
            findPaginated: jest.fn(),
            getStats: jest.fn(),
            findByName: jest.fn()
          }
        },
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn()
          }
        }
      ]
    }).compile();
    
    service = module.get<ModuleApplicationService>(ModuleApplicationService);
    moduleRepository = module.get('ModuleRepository');
    moduleReadRepository = module.get('ModuleReadRepository');
    eventBus = module.get(EventBus);
  });
  
  describe('getModulesList', () => {
    it('should return paginated modules', async () => {
      const mockResult = {
        data: [{ id: '1', name: 'Test Module' }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 }
      };
      
      moduleReadRepository.findPaginated.mockResolvedValue(mockResult);
      
      const result = await service.getModulesList(
        { search: 'test' },
        { page: 1, limit: 20 },
        { field: 'name', direction: 'ASC' }
      );
      
      expect(result).toEqual(mockResult);
      expect(moduleReadRepository.findPaginated).toHaveBeenCalledWith(
        { search: 'test' },
        { page: 1, limit: 20 },
        { field: 'name', direction: 'ASC' }
      );
    });
  });
});
```

### 2. Integration Tests
```typescript
describe('ModuleController (Integration)', () => {
  let app: INestApplication;
  let moduleRepository: Repository<ModuleEntity>;
  
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    
    app = moduleFixture.createNestApplication();
    moduleRepository = moduleFixture.get(getRepositoryToken(ModuleEntity));
    
    await app.init();
  });
  
  afterEach(async () => {
    await moduleRepository.clear();
    await app.close();
  });
  
  describe('GET /modules', () => {
    it('should return paginated modules', async () => {
      // Seed test data
      await moduleRepository.save([
        { name: 'Module 1', status: ModuleStatus.ACTIVE },
        { name: 'Module 2', status: ModuleStatus.INACTIVE }
      ]);
      
      const response = await request(app.getHttpServer())
        .get('/modules')
        .query({ page: 1, limit: 10 })
        .expect(200);
      
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.total).toBe(2);
    });
    
    it('should filter modules by status', async () => {
      await moduleRepository.save([
        { name: 'Active Module', status: ModuleStatus.ACTIVE },
        { name: 'Inactive Module', status: ModuleStatus.INACTIVE }
      ]);
      
      const response = await request(app.getHttpServer())
        .get('/modules')
        .query({ status: ModuleStatus.ACTIVE })
        .expect(200);
      
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe(ModuleStatus.ACTIVE);
    });
  });
});
```

## 📈 Performance Optimizations

### 1. Database Optimizations
```typescript
// Query Optimization
export class OptimizedModuleReadRepository {
  async findPaginatedWithStats(
    filters: ModuleFilters,
    pagination: PaginationParams,
    sorting: SortingParams
  ): Promise<PaginatedResultWithStats<ModuleListItem>> {
    // Use raw query for better performance
    const query = `
      WITH filtered_modules AS (
        SELECT 
          m.id,
          m.name,
          m.status,
          m.created_at,
          c.name as category_name,
          COUNT(*) OVER() as total_count
        FROM modules m
        LEFT JOIN categories c ON m.category_id = c.id
        WHERE 
          ($1::text IS NULL OR m.name ILIKE $1)
          AND ($2::text IS NULL OR m.status = $2)
          AND ($3::timestamp IS NULL OR m.created_at >= $3)
          AND ($4::timestamp IS NULL OR m.created_at <= $4)
          AND m.deleted_at IS NULL
        ORDER BY 
          CASE WHEN $7 = 'name' AND $8 = 'ASC' THEN m.name END ASC,
          CASE WHEN $7 = 'name' AND $8 = 'DESC' THEN m.name END DESC,
          CASE WHEN $7 = 'created_at' AND $8 = 'ASC' THEN m.created_at END ASC,
          CASE WHEN $7 = 'created_at' AND $8 = 'DESC' THEN m.created_at END DESC
        LIMIT $5 OFFSET $6
      ),
      stats AS (
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active,
          COUNT(CASE WHEN status = 'INACTIVE' THEN 1 END) as inactive
        FROM modules 
        WHERE deleted_at IS NULL
      )
      SELECT 
        fm.*,
        s.total as stats_total,
        s.active as stats_active,
        s.inactive as stats_inactive
      FROM filtered_modules fm
      CROSS JOIN stats s
    `;
    
    const searchParam = filters.search ? `%${filters.search}%` : null;
    const offset = (pagination.page - 1) * pagination.limit;
    
    const result = await this.entityManager.query(query, [
      searchParam,
      filters.status,
      filters.dateRange?.start,
      filters.dateRange?.end,
      pagination.limit,
      offset,
      sorting.field,
      sorting.direction
    ]);
    
    const data = result.map(row => ({
      id: row.id,
      name: row.name,
      status: row.status,
      createdAt: row.created_at,
      categoryName: row.category_name
    }));
    
    const total = result.length > 0 ? parseInt(result[0].total_count) : 0;
    const stats = result.length > 0 ? {
      total: parseInt(result[0].stats_total),
      active: parseInt(result[0].stats_active),
      inactive: parseInt(result[0].stats_inactive)
    } : { total: 0, active: 0, inactive: 0 };
    
    return {
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit)
      },
      stats
    };
  }
}
```

### 2. Caching Strategy
```typescript
@Injectable()
export class CachedModuleReadRepository implements ModuleReadRepository {
  constructor(
    private readonly baseRepository: ModuleReadRepository,
    private readonly cacheManager: Cache
  ) {}
  
  async findPaginated(
    filters: ModuleFilters,
    pagination: PaginationParams,
    sorting: SortingParams
  ): Promise<PaginatedResult<ModuleListItem>> {
    const cacheKey = this.generateCacheKey(filters, pagination, sorting);
    
    // Try to get from cache first
    const cached = await this.cacheManager.get<PaginatedResult<ModuleListItem>>(cacheKey);
    if (cached) {
      return cached;
    }
    
    // Fetch from database
    const result = await this.baseRepository.findPaginated(filters, pagination, sorting);
    
    // Cache for 5 minutes
    await this.cacheManager.set(cacheKey, result, 300);
    
    return result;
  }
  
  async getStats(): Promise<ModuleStats> {
    const cacheKey = 'module-stats';
    
    const cached = await this.cacheManager.get<ModuleStats>(cacheKey);
    if (cached) {
      return cached;
    }
    
    const stats = await this.baseRepository.getStats();
    
    // Cache stats for 10 minutes
    await this.cacheManager.set(cacheKey, stats, 600);
    
    return stats;
  }
  
  private generateCacheKey(
    filters: ModuleFilters,
    pagination: PaginationParams,
    sorting: SortingParams
  ): string {
    const filterStr = JSON.stringify(filters);
    const paginationStr = JSON.stringify(pagination);
    const sortingStr = JSON.stringify(sorting);
    
    return `modules-list:${Buffer.from(filterStr + paginationStr + sortingStr).toString('base64')}`;
  }
}
```

## 🔒 Security ve Validation

### 1. Input Validation
```typescript
// Custom Validation Decorators
export function IsValidSortField(validFields: string[]) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidSortField',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [validFields],
      options: {
        message: `Sort field must be one of: ${validFields.join(', ')}`
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [validFields] = args.constraints;
          return typeof value === 'string' && validFields.includes(value);
        }
      }
    });
  };
}

// Usage in DTO
export class GetModulesListQueryDto {
  @IsOptional()
  @IsString()
  @IsValidSortField(['name', 'createdAt', 'updatedAt', 'status'])
  sortBy?: string = 'createdAt';
}
```

### 2. Authorization
```typescript
// Permission-based Guard
@Injectable()
export class ModulePermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  
  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()]
    );
    
    if (!requiredPermissions) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    return requiredPermissions.every(permission => 
      user.permissions.includes(permission)
    );
  }
}

// Usage in Controller
@Controller('modules')
@UseGuards(JwtAuthGuard, ModulePermissionGuard)
export class ModuleController {
  @Get()
  @Permissions('modules:read')
  async getModulesList() {
    // Implementation
  }
  
  @Post()
  @Permissions('modules:create')
  async createModule() {
    // Implementation
  }
}
```

---

## 🎨 UI Sıralama Kuralları

### Liste Sayfaları için Standart Bileşen Sıralaması

#### Ana Yapı
1. **ProtectedRoute** - Güvenlik katmanı
2. **Sidebar** - Navigasyon menüsü
3. **DashboardHeader** - Üst başlık

#### Ana İçerik Sıralaması
```typescript
// Standart UI Bileşen Sırası
const UI_COMPONENT_ORDER = {
  1: 'Page Header',           // Sayfa başlığı ve ana aksiyonlar
  2: 'Stats Cards',           // İstatistik kartları (değiştirildi)
  3: 'Search and Filters',    // Arama ve filtreler (değiştirildi)
  4: 'Error Messages',        // API hata mesajları
  5: 'Main Content Area',     // GenericListView/GenericGridView
  6: 'Pagination'             // Sayfalama kontrolleri
} as const;
```

#### Detaylı Sıralama
```jsx
// Liste Sayfası Render Sırası
return (
  <ProtectedRoute>
    <div className="flex h-screen bg-background-light">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Sıra 1: Page Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-text-on-light">
                  {pageTitle}
                </h1>
                <p className="text-text-light-secondary mt-2">
                  {pageDescription}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <ExportDropdown />
                <Button variant="primary" onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Ekle
                </Button>
              </div>
            </div>

            {/* Sıra 2: Stats Cards (İstatistik Kartları) */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {statsData.map((stat) => (
                <StatsCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  color={stat.color}
                  icon={stat.icon}
                  size="md"
                  loading={stat.loading}
                />
              ))}
            </div>

            {/* Sıra 3: Search and Filters (Arama ve Filtreler) */}
            <Card className="mb-6">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <SearchBar
                      placeholder="Ara..."
                      value={searchInput}
                      onChange={setSearchInput}
                      onSearch={handleSearchSubmit}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(true)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filtreler
                      {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                    <ViewToggle
                      options={VIEW_OPTIONS}
                      activeView={viewMode}
                      onViewChange={setViewMode}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Sıra 4: Error Messages */}
            {apiError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{apiError}</p>
              </div>
            )}

            {/* Sıra 5: Main Content Area */}
            {viewMode === 'table' ? (
              <GenericListView
                data={data}
                loading={loading}
                error={error}
                columns={tableColumns}
                onSelectionChange={handleSelectionChange}
                selectedItems={selectedItems}
                bulkActions={bulkActions}
                onSort={handleSort}
                sortConfig={sortConfig}
                actionMenu={ActionMenu}
              />
            ) : (
              <GenericGridView
                data={data}
                loading={loading}
                error={error}
                onSelectionChange={handleGridSelectionChange}
                selectedItems={selectedItems}
                bulkActions={bulkActions}
                renderCard={renderCard}
                getItemId={getItemId}
                gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                actionMenu={ActionMenu}
              />
            )}

            {/* Sıra 6: Pagination */}
            <TablePagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalRecords={pagination.total}
              recordsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onRecordsPerPageChange={handleRecordsPerPageChange}
            />
          </div>
        </main>
      </div>
    </div>

    {/* Overlay Bileşenleri */}
    <FilterPanel
      isOpen={showFilters}
      filterGroups={filterGroups}
      activeFilters={activeFilters}
      onApplyFilters={handleApplyFilters}
      onResetFilters={handleResetFilters}
      onClose={() => setShowFilters(false)}
      variant="drawer"
    />
    
    <ConfirmationModal
      isOpen={showDeleteModal}
      title="Silme Onayı"
      message="Bu işlem geri alınamaz. Devam etmek istiyor musunuz?"
      onConfirm={handleConfirmDelete}
      onCancel={() => setShowDeleteModal(false)}
      variant="danger"
    />
    
    <ToastContainer />
  </ProtectedRoute>
);
```

#### Component Yerleşim Detayları

##### Responsive Breakpoints
```css
/* Stats Cards Grid */
.stats-grid {
  @apply grid gap-4 mb-6;
  grid-template-columns: repeat(2, 1fr); /* Mobile: 2 columns */
}

@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(5, 1fr); /* Desktop: 5 columns */
  }
}

/* Search and Filters */
.search-filters {
  @apply flex gap-4;
  flex-direction: column; /* Mobile: stacked */
}

@media (min-width: 1024px) {
  .search-filters {
    flex-direction: row; /* Desktop: horizontal */
  }
}
```

##### Z-Index Hiyerarşisi
```typescript
const Z_INDEX_LAYERS = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  modal: 30,
  toast: 40,
  tooltip: 50
} as const;
```

##### Container Sınıfları
```typescript
const CONTAINER_CLASSES = {
  main: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8',
  card: 'bg-background-card border border-primary-gold/20 rounded-2xl shadow-lg',
  section: 'mb-6',
  grid: 'grid gap-4',
  flex: 'flex items-center gap-3'
} as const;
```

### Önemli Notlar

1. **Stats Cards** artık **Search and Filters**'dan önce gelir
2. Bu sıralama tüm liste sayfalarında tutarlı olmalıdır
3. Responsive tasarım kuralları her bileşen için uygulanmalıdır
4. Z-index değerleri overlay bileşenleri için kritiktir
5. Container sınıfları design system'e uygun olmalıdır

---

**Not**: Bu mimari kurallar enterprise-level NestJS uygulamaları için tasarlanmıştır. Clean Architecture, DDD ve CQRS pattern'lerini takip ederek scalable ve maintainable kod yazımını destekler.