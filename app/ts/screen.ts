export interface IScreen {
    update(deltaTime: number): void;
    draw(ctx: CanvasRenderingContext2D, deltaTime: number): void;
}

export interface IScreenConstructor {
    new (oldScreen?: IScreen): IScreen;
}
